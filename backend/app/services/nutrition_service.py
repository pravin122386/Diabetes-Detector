"""
Nutrition Estimation Service.
Calculates BMR (Mifflin-St Jeor), Total Daily Energy Expenditure (TDEE),
Target Daily Calories based on Goal, and Recommended Macronutrient/Fiber Splits.

IMPORTANT DISCLAIMER:
These calculations are estimated guidelines for healthy adults and do not constitute
medical advice, clinical diagnosis, or dietary prescription.
"""

from backend.app.schemas.pydantic_schemas import NutritionTargetResponse

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9
}

GOAL_ADJUSTMENTS = {
    "weight_loss": 0.80,         # 20% Caloric Deficit
    "weight_maintenance": 1.00,  # Maintenance
    "weight_gain": 1.15,         # 15% Caloric Surplus
    "muscle_gain": 1.20          # 20% Caloric Surplus
}

def calculate_nutritional_requirements(
    age: int,
    gender: str,
    height_cm: float,
    weight_kg: float,
    activity_level: str = "moderate",
    goal: str = "weight_maintenance"
) -> NutritionTargetResponse:
    """
    Calculates estimated daily calories, protein, carbohydrates, fat, and fiber targets.
    """
    # 1. Base Metabolic Rate (BMR) via Mifflin-St Jeor Equation
    gender_clean = str(gender).lower().strip()
    if gender_clean in ["male", "m"]:
        bmr = (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age) + 5.0
    else:
        bmr = (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age) - 161.0

    # 2. Total Daily Energy Expenditure (TDEE)
    act_key = str(activity_level).lower().strip()
    mult = ACTIVITY_MULTIPLIERS.get(act_key, 1.55)
    tdee = bmr * mult

    # 3. Goal Adjustment
    goal_key = str(goal).lower().strip()
    adj = GOAL_ADJUSTMENTS.get(goal_key, 1.00)
    target_calories = tdee * adj

    # 4. Macronutrient Targets
    if goal_key in ["muscle_gain", "weight_gain"]:
        protein_g = weight_kg * 2.0
    else:
        protein_g = weight_kg * 1.6

    # Fat target: 25% of total calories (9 kcal/g)
    fat_calories = target_calories * 0.25
    fat_g = fat_calories / 9.0

    # Carbohydrate target: Remaining calories (4 kcal/g)
    protein_calories = protein_g * 4.0
    carb_calories = max(0.0, target_calories - protein_calories - fat_calories)
    carbs_g = carb_calories / 4.0

    # Fiber target: ~14g per 1000 kcal
    fiber_g = (target_calories / 1000.0) * 14.0

    return NutritionTargetResponse(
        daily_calories=round(target_calories, 1),
        protein_g=round(protein_g, 1),
        carbohydrates_g=round(carbs_g, 1),
        fat_g=round(fat_g, 1),
        fiber_g=round(fiber_g, 1),
        disclaimer="Estimates only. Not medical advice or prescription."
    )
