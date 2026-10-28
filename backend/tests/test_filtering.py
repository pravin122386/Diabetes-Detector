"""
Unit tests for Rule-Based Hard Constraint Filtering Service.
Tests diet filtering and allergy hard constraints.
"""

from backend.app.models.database_models import RecipeDB
from backend.app.services.filtering_service import filter_diet, filter_allergens

def test_allergy_hard_filtering_peanuts():
    sample_recipes = [
        RecipeDB(recipe_id=1, recipe_name="Poha with Peanuts", ingredients="Poha, Peanuts, Mustard", allergens="Peanuts, Mustard"),
        RecipeDB(recipe_id=2, recipe_name="Steamed Idli", ingredients="Rice, Urad Dal", allergens="None"),
        RecipeDB(recipe_id=3, recipe_name="Sabudana Khichdi", ingredients="Sabudana, Groundnuts, Ghee", allergens="Peanuts, Dairy")
    ]
    
    filtered = filter_allergens(sample_recipes, ["Peanuts"])
    assert len(filtered) == 1
    assert filtered[0].recipe_id == 2
    assert "Idli" in filtered[0].recipe_name

def test_diet_filtering_vegetarian():
    sample_recipes = [
        RecipeDB(recipe_id=1, recipe_name="Chicken Curry", diet_type="Non-Vegetarian", ingredients="Chicken, Spices"),
        RecipeDB(recipe_id=2, recipe_name="Paneer Butter Masala", diet_type="Vegetarian", ingredients="Paneer, Butter, Tomato"),
        RecipeDB(recipe_id=3, recipe_name="Vegetable Biryani", diet_type="Vegan", ingredients="Rice, Vegetables")
    ]
    
    filtered = filter_diet(sample_recipes, "vegetarian")
    assert len(filtered) == 2
    assert set([r.recipe_id for r in filtered]) == {2, 3}

def test_diet_filtering_vegan():
    sample_recipes = [
        RecipeDB(recipe_id=1, recipe_name="Paneer Tikka", diet_type="Vegetarian", ingredients="Paneer, Curd, Spices"),
        RecipeDB(recipe_id=2, recipe_name="Plain Rice", diet_type="Vegan", ingredients="Rice, Water"),
        RecipeDB(recipe_id=3, recipe_name="Dalma", diet_type="Vegan", ingredients="Toor Dal, Raw Papaya, Vegetables")
    ]
    
    filtered = filter_diet(sample_recipes, "vegan")
    assert len(filtered) == 2
    assert set([r.recipe_id for r in filtered]) == {2, 3}
