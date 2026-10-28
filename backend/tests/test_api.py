"""
Integration API tests using TestClient.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "IFCT 2017" in data["data_sources"]["nutritional_foundation"]

def test_nutrition_calculate_endpoint():
    payload = {
        "age": 25,
        "gender": "male",
        "height_cm": 175.0,
        "weight_kg": 70.0,
        "activity_level": "moderate",
        "goal": "muscle_gain"
    }
    res = client.post("/api/nutrition/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["daily_calories"] > 2000.0
    assert data["protein_g"] > 100.0

def test_recipes_get_endpoint():
    res = client.get("/api/recipes")
    assert res.status_code == 200
    recipes = res.json()
    assert isinstance(recipes, list)
    assert len(recipes) > 0

def test_recommendations_endpoint():
    payload = {
        "age": 25,
        "gender": "male",
        "height_cm": 175.0,
        "weight_kg": 70.0,
        "activity_level": "moderate",
        "goal": "muscle_gain",
        "diet_type": "vegetarian",
        "meal_type": "lunch"
    }
    res = client.post("/api/recommendations", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
