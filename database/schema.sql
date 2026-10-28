-- Database Schema for Personalized Indian Meal Recommendation System
-- Supports PostgreSQL and SQLite syntax

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    height_cm REAL NOT NULL,
    weight_kg REAL NOT NULL,
    activity_level VARCHAR(50) NOT NULL,
    goal VARCHAR(50) NOT NULL,
    diet_type VARCHAR(50) NOT NULL,
    meals_per_day INTEGER DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preferred_region VARCHAR(100),
    preferred_cuisine VARCHAR(100),
    allergies TEXT,
    disliked_foods TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS foods (
    food_id VARCHAR(50) PRIMARY KEY,
    food_name VARCHAR(200) NOT NULL,
    scientific_name VARCHAR(200),
    local_name VARCHAR(200),
    food_group VARCHAR(100),
    region VARCHAR(100),
    energy_kcal REAL,
    protein_g REAL,
    carbohydrate_g REAL,
    fat_g REAL,
    fiber_g REAL,
    sugar_g REAL,
    calcium_mg REAL,
    iron_mg REAL,
    sodium_mg REAL,
    potassium_mg REAL
);

CREATE TABLE IF NOT EXISTS recipes (
    recipe_id INTEGER PRIMARY KEY,
    recipe_name VARCHAR(200) NOT NULL,
    region VARCHAR(100),
    cuisine VARCHAR(100),
    meal_type VARCHAR(50),
    diet_type VARCHAR(50),
    serving_size_g REAL,
    calories REAL,
    protein_g REAL,
    carbohydrates_g REAL,
    fat_g REAL,
    fiber_g REAL,
    sugar_g REAL,
    sodium_mg REAL,
    ingredients TEXT,
    allergens TEXT,
    cluster INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    food_id VARCHAR(50) NOT NULL,
    quantity_g REAL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendation_history (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    meal_type VARCHAR(50),
    recommendation_score REAL,
    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    rating INTEGER,
    liked BOOLEAN DEFAULT FALSE,
    replaced BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_meals (
    saved_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    meal_type VARCHAR(50),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);
