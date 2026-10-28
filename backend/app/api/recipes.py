"""
Recipe and IFCT Food Catalog API Endpoints.
Supports search, filtering, and detailed retrieval.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.database_models import RecipeDB, FoodDB
from backend.app.schemas.pydantic_schemas import RecipeResponse, FoodResponse

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])

@router.get("", response_model=List[RecipeResponse])
def get_recipes(
    search: Optional[str] = None,
    meal_type: Optional[str] = None,
    diet_type: Optional[str] = None,
    cuisine: Optional[str] = None,
    region: Optional[str] = None,
    max_calories: Optional[float] = None,
    min_protein: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(RecipeDB)

    if search:
        s_term = f"%{search.strip()}%"
        query = query.filter(
            (RecipeDB.recipe_name.ilike(s_term)) |
            (RecipeDB.ingredients.ilike(s_term)) |
            (RecipeDB.cuisine.ilike(s_term))
        )
    if meal_type and meal_type.lower() != "all":
        query = query.filter(RecipeDB.meal_type.ilike(f"%{meal_type.strip()}%"))
    if diet_type and diet_type.lower() != "all":
        query = query.filter(RecipeDB.diet_type.ilike(f"%{diet_type.strip()}%"))
    if cuisine and cuisine.lower() != "all":
        query = query.filter(RecipeDB.cuisine.ilike(f"%{cuisine.strip()}%"))
    if region and region.lower() != "all":
        query = query.filter(RecipeDB.region.ilike(f"%{region.strip()}%"))
    if max_calories is not None:
        query = query.filter(RecipeDB.calories <= max_calories)
    if min_protein is not None:
        query = query.filter(RecipeDB.protein_g >= min_protein)

    return query.all()

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(RecipeDB).filter(RecipeDB.recipe_id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail=f"Recipe with ID {recipe_id} not found.")
    return recipe

@router.get("/foods/ifct", response_model=List[FoodResponse])
def get_ifct_foods(food_group: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FoodDB)
    if food_group:
        query = query.filter(FoodDB.food_group.ilike(f"%{food_group.strip()}%"))
    return query.all()
