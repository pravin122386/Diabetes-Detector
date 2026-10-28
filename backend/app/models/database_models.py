"""
SQLAlchemy ORM Models for Users, Preferences, Foods (IFCT), Recipes (INDB),
Recommendation History, Meal Feedback, and Saved Meals.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class UserDB(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    activity_level = Column(String(50), nullable=False)
    goal = Column(String(50), nullable=False)
    diet_type = Column(String(50), nullable=False)
    meals_per_day = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.utcnow)

    preferences = relationship("UserPreferenceDB", back_populates="user", uselist=False, cascade="all, delete-orphan")
    history = relationship("RecommendationHistoryDB", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("MealFeedbackDB", back_populates="user", cascade="all, delete-orphan")
    saved_meals = relationship("SavedMealDB", back_populates="user", cascade="all, delete-orphan")

class UserPreferenceDB(Base):
    __tablename__ = "user_preferences"

    preference_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    preferred_region = Column(String(100))
    preferred_cuisine = Column(String(100))
    allergies = Column(Text, default="[]")
    disliked_foods = Column(Text, default="[]")

    user = relationship("UserDB", back_populates="preferences")

class FoodDB(Base):
    __tablename__ = "foods"

    food_id = Column(String(50), primary_key=True, index=True)
    food_name = Column(String(200), nullable=False)
    scientific_name = Column(String(200))
    local_name = Column(String(200))
    food_group = Column(String(100))
    region = Column(String(100))
    energy_kcal = Column(Float)
    protein_g = Column(Float)
    carbohydrate_g = Column(Float)
    fat_g = Column(Float)
    fiber_g = Column(Float)
    sugar_g = Column(Float)
    calcium_mg = Column(Float)
    iron_mg = Column(Float)
    sodium_mg = Column(Float)
    potassium_mg = Column(Float)

class RecipeDB(Base):
    __tablename__ = "recipes"

    recipe_id = Column(Integer, primary_key=True, index=True)
    recipe_name = Column(String(200), nullable=False)
    region = Column(String(100))
    cuisine = Column(String(100))
    meal_type = Column(String(50))
    diet_type = Column(String(50))
    serving_size_g = Column(Float)
    calories = Column(Float)
    protein_g = Column(Float)
    carbohydrates_g = Column(Float)
    fat_g = Column(Float)
    fiber_g = Column(Float)
    sugar_g = Column(Float)
    sodium_mg = Column(Float)
    ingredients = Column(Text)
    allergens = Column(Text)
    cluster = Column(Integer, default=0)

class RecommendationHistoryDB(Base):
    __tablename__ = "recommendation_history"

    history_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id", ondelete="CASCADE"), nullable=False)
    meal_type = Column(String(50))
    recommendation_score = Column(Float)
    recommended_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserDB", back_populates="history")
    recipe = relationship("RecipeDB")

class MealFeedbackDB(Base):
    __tablename__ = "meal_feedback"

    feedback_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer)
    liked = Column(Boolean, default=False)
    replaced = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserDB", back_populates="feedback")
    recipe = relationship("RecipeDB")

class SavedMealDB(Base):
    __tablename__ = "saved_meals"

    saved_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.recipe_id", ondelete="CASCADE"), nullable=False)
    meal_type = Column(String(50))
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserDB", back_populates="saved_meals")
    recipe = relationship("RecipeDB")
