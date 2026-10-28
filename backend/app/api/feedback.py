"""
User Meal Feedback and Saved Meals API Endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.database_models import MealFeedbackDB, SavedMealDB, RecipeDB
from backend.app.schemas.pydantic_schemas import FeedbackCreate, FeedbackResponse, SavedMealCreate, RecipeResponse

router = APIRouter(prefix="/api", tags=["Feedback & Saved Meals"])

@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(fb_in: FeedbackCreate, db: Session = Depends(get_db)):
    fb = MealFeedbackDB(
        user_id=fb_in.user_id,
        recipe_id=fb_in.recipe_id,
        rating=fb_in.rating,
        liked=fb_in.liked or False,
        replaced=fb_in.replaced or False
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb

@router.post("/saved-meals")
def save_meal(saved_in: SavedMealCreate, db: Session = Depends(get_db)):
    existing = db.query(SavedMealDB).filter(
        SavedMealDB.user_id == saved_in.user_id,
        SavedMealDB.recipe_id == saved_in.recipe_id
    ).first()

    if existing:
        return {"message": "Meal already saved.", "saved_id": existing.saved_id}

    saved = SavedMealDB(
        user_id=saved_in.user_id,
        recipe_id=saved_in.recipe_id,
        meal_type=saved_in.meal_type
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return {"message": "Meal saved successfully.", "saved_id": saved.saved_id}

@router.get("/users/{user_id}/saved-meals", response_model=List[RecipeResponse])
def get_user_saved_meals(user_id: int, db: Session = Depends(get_db)):
    saved = db.query(SavedMealDB).filter(SavedMealDB.user_id == user_id).all()
    recipe_ids = [s.recipe_id for s in saved]
    recipes = db.query(RecipeDB).filter(RecipeDB.recipe_id.in_(recipe_ids)).all()
    return recipes
