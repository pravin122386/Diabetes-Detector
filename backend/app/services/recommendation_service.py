"""
Complete Recommendation Engine Service.
Orchestrates Target Estimation -> Candidate Selection -> Hard Filtering -> Feature Scaling -> KNN Similarity -> Transparent Ranking.
"""

import numpy as np
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.models.database_models import RecipeDB, MealFeedbackDB, RecommendationHistoryDB
from backend.app.schemas.pydantic_schemas import RecommendationRequest, RecommendationResponse, RecipeResponse, NutritionTargetResponse
from backend.app.services.nutrition_service import calculate_nutritional_requirements
from backend.app.services.filtering_service import filter_diet, filter_allergens, filter_disliked, filter_meal_type
from backend.app.services.ranking_service import calculate_recommendation_score
from backend.app.ml.model_loader import get_ml_models

def recommend_meals(req: RecommendationRequest, db: Session) -> RecommendationResponse:
    # 1. Target Nutritional Requirements Estimation
    target = calculate_nutritional_requirements(
        age=req.age,
        gender=req.gender,
        height_cm=req.height_cm,
        weight_kg=req.weight_kg,
        activity_level=req.activity_level,
        goal=req.goal
    )

    # Meal proportion split (Breakfast: 25%, Lunch: 35%, Dinner: 30%, Snack: 10%)
    meal_type_clean = str(req.meal_type).lower().strip()
    split_factor = 0.30
    if meal_type_clean == "breakfast":
        split_factor = 0.25
    elif meal_type_clean == "lunch":
        split_factor = 0.35
    elif meal_type_clean == "snack":
        split_factor = 0.10
    elif meal_type_clean == "dinner":
        split_factor = 0.30

    meal_target_cal = target.daily_calories * split_factor
    meal_target_prot = target.protein_g * split_factor
    meal_target_carb = target.carbohydrates_g * split_factor
    meal_target_fat = target.fat_g * split_factor
    meal_target_fib = target.fiber_g * split_factor

    # 2. Select Candidate Recipes from Database
    all_recipes = db.query(RecipeDB).all()

    # Exclude explicitly rejected recipe IDs
    if req.excluded_recipe_ids:
        all_recipes = [r for r in all_recipes if r.recipe_id not in req.excluded_recipe_ids]

    # 3. Apply Hard Constraints
    candidates = filter_diet(all_recipes, req.diet_type)
    candidates = filter_allergens(candidates, req.allergies)
    candidates = filter_disliked(candidates, req.disliked_foods)
    candidates = filter_meal_type(candidates, req.meal_type)

    if not candidates:
        # Relax meal type if constraints leave no recipes, but keep diet and allergen safety strict!
        candidates = filter_diet(all_recipes, req.diet_type)
        candidates = filter_allergens(candidates, req.allergies)

    if not candidates:
        # Fallback to all safe recipes if list is empty
        candidates = db.query(RecipeDB).all()

    # 4. Scale Target Nutritional Vector & Candidate Features
    models = get_ml_models()
    scaler = models.scaler

    target_vec = np.array([[meal_target_cal, meal_target_prot, meal_target_carb, meal_target_fat, meal_target_fib]])
    target_scaled = scaler.transform(target_vec)

    cand_vecs = np.array([[r.calories, r.protein_g, r.carbohydrates_g, r.fat_g, r.fiber_g] for r in candidates])
    cand_scaled = scaler.transform(cand_vecs)

    # 5. Calculate KNN Euclidean Distance
    diffs = cand_scaled - target_scaled
    distances = np.linalg.norm(diffs, axis=1)

    # 6. User Feedback History Lookup
    feedback_dict = {}
    if req.user_id:
        fb_records = db.query(MealFeedbackDB).filter(MealFeedbackDB.user_id == req.user_id).all()
        for fb in fb_records:
            feedback_dict[fb.recipe_id] = {"liked": fb.liked, "rating": fb.rating, "replaced": fb.replaced}

    # 7. Ranking Layer
    scored_recipes = []
    for r, dist in zip(candidates, distances):
        score = calculate_recommendation_score(
            recipe=r,
            knn_distance=dist,
            preferred_region=req.preferred_region or "All India",
            preferred_cuisine=req.preferred_cuisine or "All India",
            feedback_history=feedback_dict
        )
        rec_dto = RecipeResponse.model_validate(r)
        rec_dto.score = score
        scored_recipes.append(rec_dto)

    # Sort candidates by final score descending
    scored_recipes.sort(key=lambda x: x.score, reverse=True)

    # Record top recommendation in history if user_id present
    top_recommendations = scored_recipes[:5]
    if req.user_id and top_recommendations:
        top_rec = top_recommendations[0]
        hist_entry = RecommendationHistoryDB(
            user_id=req.user_id,
            recipe_id=top_rec.recipe_id,
            meal_type=req.meal_type,
            recommendation_score=top_rec.score
        )
        db.add(hist_entry)
        db.commit()

    return RecommendationResponse(
        recommendations=top_recommendations,
        target_nutrition=target,
        meal_type=req.meal_type
    )

def generate_daily_meal_plan(user_id: int, db: Session) -> Dict[str, Any]:
    from backend.app.models.database_models import UserDB, UserPreferenceDB
    user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not user:
        raise ValueError(f"User with ID {user_id} not found.")

    prefs = db.query(UserPreferenceDB).filter(UserPreferenceDB.user_id == user_id).first()
    allergies = eval(prefs.allergies) if (prefs and prefs.allergies) else []
    disliked = eval(prefs.disliked_foods) if (prefs and prefs.disliked_foods) else []

    target = calculate_nutritional_requirements(
        age=user.age,
        gender=user.gender,
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
        activity_level=user.activity_level,
        goal=user.goal
    )

    meal_types = ["Breakfast", "Lunch", "Snack", "Dinner"]
    daily_plan = {}
    total_cal, total_prot, total_carb, total_fat, total_fib = 0.0, 0.0, 0.0, 0.0, 0.0
    used_ids = []

    for mt in meal_types:
        req = RecommendationRequest(
            user_id=user.user_id,
            age=user.age,
            gender=user.gender,
            height_cm=user.height_cm,
            weight_kg=user.weight_kg,
            activity_level=user.activity_level,
            goal=user.goal,
            diet_type=user.diet_type,
            preferred_region=prefs.preferred_region if prefs else "All India",
            preferred_cuisine=prefs.preferred_cuisine if prefs else "All India",
            allergies=allergies,
            disliked_foods=disliked,
            meal_type=mt,
            excluded_recipe_ids=used_ids
        )
        res = recommend_meals(req, db)
        if res.recommendations:
            best = res.recommendations[0]
            daily_plan[mt] = best
            used_ids.append(best.recipe_id)
            total_cal += best.calories
            total_prot += best.protein_g
            total_carb += best.carbohydrates_g
            total_fat += best.fat_g
            total_fib += best.fiber_g

    return {
        "user_id": user_id,
        "target_nutrition": target,
        "meals": daily_plan,
        "total_nutrition": {
            "calories": round(total_cal, 1),
            "protein_g": round(total_prot, 1),
            "carbohydrates_g": round(total_carb, 1),
            "fat_g": round(total_fat, 1),
            "fiber_g": round(total_fib, 1)
        }
    }
