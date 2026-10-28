"""
User Management and Profile API Endpoints.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.database_models import UserDB, UserPreferenceDB
from backend.app.schemas.pydantic_schemas import UserProfileCreate, UserProfileResponse, DailyMealPlanResponse
from backend.app.services.recommendation_service import generate_daily_meal_plan

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("", response_model=UserProfileResponse)
def create_user(user_in: UserProfileCreate, db: Session = Depends(get_db)):
    user = UserDB(
        name=user_in.name,
        age=user_in.age,
        gender=user_in.gender,
        height_cm=user_in.height_cm,
        weight_kg=user_in.weight_kg,
        activity_level=user_in.activity_level,
        goal=user_in.goal,
        diet_type=user_in.diet_type,
        meals_per_day=user_in.meals_per_day
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    prefs = UserPreferenceDB(
        user_id=user.user_id,
        preferred_region=user_in.preferred_region or "All India",
        preferred_cuisine=user_in.preferred_cuisine or "All India",
        allergies=json.dumps(user_in.allergies or []),
        disliked_foods=json.dumps(user_in.disliked_foods or [])
    )
    db.add(prefs)
    db.commit()

    return user

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found.")

    prefs = db.query(UserPreferenceDB).filter(UserPreferenceDB.user_id == user_id).first()
    allergies = json.loads(prefs.allergies) if (prefs and prefs.allergies) else []
    disliked = json.loads(prefs.disliked_foods) if (prefs and prefs.disliked_foods) else []

    return {
        "user_id": user.user_id,
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "height_cm": user.height_cm,
        "weight_kg": user.weight_kg,
        "activity_level": user.activity_level,
        "goal": user.goal,
        "diet_type": user.diet_type,
        "meals_per_day": user.meals_per_day,
        "created_at": user.created_at,
        "preferences": {
            "preferred_region": prefs.preferred_region if prefs else "All India",
            "preferred_cuisine": prefs.preferred_cuisine if prefs else "All India",
            "allergies": allergies,
            "disliked_foods": disliked
        }
    }

@router.get("/{user_id}/meal-plan")
def get_user_daily_meal_plan(user_id: int, db: Session = Depends(get_db)):
    try:
        return generate_daily_meal_plan(user_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
