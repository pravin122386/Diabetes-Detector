"""
Pydantic Schemas for API Requests, Responses, Profiles, Nutrition Targets,
Recommendation Objects, Feedback, and Search Parameters.
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class UserProfileCreate(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Aarav Sharma"})
    age: int = Field(..., ge=12, le=120, json_schema_extra={"example": 25})
    gender: str = Field(..., json_schema_extra={"example": "male"})
    height_cm: float = Field(..., ge=50, le=250, json_schema_extra={"example": 175.0})
    weight_kg: float = Field(..., ge=20, le=300, json_schema_extra={"example": 70.0})
    activity_level: str = Field(..., json_schema_extra={"example": "moderate"})  # sedentary, light, moderate, active, very_active
    goal: str = Field(..., json_schema_extra={"example": "muscle_gain"})  # weight_loss, weight_maintenance, weight_gain, muscle_gain
    diet_type: str = Field(..., json_schema_extra={"example": "vegetarian"})  # vegetarian, non_vegetarian, vegan
    meals_per_day: int = Field(4, ge=1, le=6, json_schema_extra={"example": 4})
    preferred_region: Optional[str] = Field("All India", json_schema_extra={"example": "South Indian"})
    preferred_cuisine: Optional[str] = Field("All India", json_schema_extra={"example": "South Indian"})
    allergies: Optional[List[str]] = Field(default_factory=list, json_schema_extra={"example": ["Peanuts"]})
    disliked_foods: Optional[List[str]] = Field(default_factory=list, json_schema_extra={"example": ["Brinjal"]})

class UserProfileResponse(BaseModel):
    user_id: int
    name: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    activity_level: str
    goal: str
    diet_type: str
    meals_per_day: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class NutritionCalcRequest(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    activity_level: str
    goal: str

class NutritionTargetResponse(BaseModel):
    daily_calories: float
    protein_g: float
    carbohydrates_g: float
    fat_g: float
    fiber_g: float
    disclaimer: str = "Estimates only. Not medical advice or prescription."

class RecipeResponse(BaseModel):
    recipe_id: int
    recipe_name: str
    region: Optional[str]
    cuisine: Optional[str]
    meal_type: Optional[str]
    diet_type: Optional[str]
    serving_size_g: Optional[float]
    calories: float
    protein_g: float
    carbohydrates_g: float
    fat_g: float
    fiber_g: float
    sugar_g: Optional[float]
    sodium_mg: Optional[float]
    ingredients: Optional[str]
    allergens: Optional[str]
    score: Optional[float] = None
    cluster: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

class FoodResponse(BaseModel):
    food_id: str
    food_name: str
    scientific_name: Optional[str]
    local_name: Optional[str]
    food_group: Optional[str]
    region: Optional[str]
    energy_kcal: float
    protein_g: float
    carbohydrate_g: float
    fat_g: float
    fiber_g: float
    sugar_g: Optional[float]
    calcium_mg: Optional[float]
    iron_mg: Optional[float]
    sodium_mg: Optional[float]
    potassium_mg: Optional[float]

    model_config = ConfigDict(from_attributes=True)

class RecommendationRequest(BaseModel):
    user_id: Optional[int] = None
    age: int = 25
    gender: str = "male"
    height_cm: float = 175.0
    weight_kg: float = 70.0
    activity_level: str = "moderate"
    goal: str = "muscle_gain"
    diet_type: str = "vegetarian"
    preferred_region: Optional[str] = "All India"
    preferred_cuisine: Optional[str] = "All India"
    allergies: List[str] = []
    disliked_foods: List[str] = []
    meal_type: str = "lunch"
    excluded_recipe_ids: List[int] = []

class RecommendationResponse(BaseModel):
    recommendations: List[RecipeResponse]
    target_nutrition: NutritionTargetResponse
    meal_type: str

class ReplaceRecommendationRequest(BaseModel):
    user_id: Optional[int] = None
    meal_type: str
    rejected_recipe_id: int
    current_recipe_ids: List[int] = []
    diet_type: str = "vegetarian"
    allergies: List[str] = []
    disliked_foods: List[str] = []
    preferred_region: Optional[str] = "All India"

class FeedbackCreate(BaseModel):
    user_id: int
    recipe_id: int
    rating: Optional[int] = Field(None, ge=1, le=5)
    liked: Optional[bool] = False
    replaced: Optional[bool] = False

class FeedbackResponse(BaseModel):
    feedback_id: int
    user_id: int
    recipe_id: int
    rating: Optional[int]
    liked: bool
    replaced: bool
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class SavedMealCreate(BaseModel):
    user_id: int
    recipe_id: int
    meal_type: str

class DailyMealPlanResponse(BaseModel):
    user_id: int
    target_nutrition: NutritionTargetResponse
    meals: dict  # {"Breakfast": RecipeResponse, "Lunch": ..., "Snack": ..., "Dinner": ...}
    total_nutrition: dict  # {"calories": ..., "protein_g": ..., "carbohydrates_g": ..., "fat_g": ..., "fiber_g": ...}

