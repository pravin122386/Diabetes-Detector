"""
Unit tests for Nutrition Estimation Service.
"""

from backend.app.services.nutrition_service import calculate_nutritional_requirements

def test_calculate_nutrition_male_muscle_gain():
    res = calculate_nutritional_requirements(
        age=25,
        gender="male",
        height_cm=175.0,
        weight_kg=70.0,
        activity_level="moderate",
        goal="muscle_gain"
    )
    assert res.daily_calories > 2000.0
    assert res.protein_g >= 140.0  # ~2.0g per kg
    assert res.carbohydrates_g > 0
    assert res.fat_g > 0
    assert res.fiber_g > 20.0
    assert "Estimates only" in res.disclaimer

def test_calculate_nutrition_female_weight_loss():
    res = calculate_nutritional_requirements(
        age=30,
        gender="female",
        height_cm=160.0,
        weight_kg=65.0,
        activity_level="light",
        goal="weight_loss"
    )
    assert res.daily_calories > 1000.0
    assert res.protein_g > 0
    assert res.carbohydrates_g > 0
