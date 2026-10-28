"""
Nutrition Calculation API Endpoint.
"""

from fastapi import APIRouter
from backend.app.schemas.pydantic_schemas import NutritionCalcRequest, NutritionTargetResponse
from backend.app.services.nutrition_service import calculate_nutritional_requirements

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])

@router.post("/calculate", response_model=NutritionTargetResponse)
def calculate_nutrition(req: NutritionCalcRequest):
    return calculate_nutritional_requirements(
        age=req.age,
        gender=req.gender,
        height_cm=req.height_cm,
        weight_kg=req.weight_kg,
        activity_level=req.activity_level,
        goal=req.goal
    )
