"""
Recommendation and Recipe Replacement API Endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.schemas.pydantic_schemas import RecommendationRequest, RecommendationResponse, ReplaceRecommendationRequest, RecipeResponse
from backend.app.services.recommendation_service import recommend_meals

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest, db: Session = Depends(get_db)):
    return recommend_meals(req, db)

@router.post("/replace", response_model=RecipeResponse)
def replace_recommendation(req: ReplaceRecommendationRequest, db: Session = Depends(get_db)):
    # Build list of excluded recipes combining rejected recipe ID and current active recipes
    excluded = list(set([req.rejected_recipe_id] + req.current_recipe_ids))

    rec_req = RecommendationRequest(
        user_id=req.user_id,
        meal_type=req.meal_type,
        diet_type=req.diet_type,
        allergies=req.allergies,
        disliked_foods=req.disliked_foods,
        preferred_region=req.preferred_region,
        excluded_recipe_ids=excluded
    )

    res = recommend_meals(rec_req, db)
    if not res.recommendations:
        raise HTTPException(status_code=404, detail="No alternative suitable recipe found for replacement.")

    return res.recommendations[0]
