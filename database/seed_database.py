"""
Script to generate seed.sql and seed backend/app/meal_rec.db directly from processed datasets.
"""

import os
import sqlite3
import pandas as pd

def clean_sql_str(val):
    if pd.isna(val) or val is None:
        return ""
    return str(val).replace("'", "''")

def seed_all():
    os.makedirs("database", exist_ok=True)
    os.makedirs("backend/app", exist_ok=True)
    
    db_path = "backend/app/meal_rec.db"
    schema_path = "database/schema.sql"
    seed_sql_path = "database/seed.sql"
    
    ifct_path = "ml/data/processed/ifct_processed.csv"
    recipes_path = "ml/data/processed/recipes_processed.csv"
    
    df_ifct = pd.read_csv(ifct_path)
    df_recipes = pd.read_csv(recipes_path)
    
    # Connect to SQLite DB
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Read schema SQL
    with open(schema_path, "r") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)
    
    # Clear existing tables for seed freshness
    cursor.execute("DELETE FROM foods;")
    cursor.execute("DELETE FROM recipes;")
    cursor.execute("DELETE FROM users;")
    cursor.execute("DELETE FROM user_preferences;")
    
    # Insert IFCT foods
    df_ifct.to_sql("foods", conn, if_exists="append", index=False)
    
    # Insert Recipes
    df_recipes.to_sql("recipes", conn, if_exists="append", index=False)
    
    # Insert default test user
    cursor.execute("""
        INSERT INTO users (name, age, gender, height_cm, weight_kg, activity_level, goal, diet_type, meals_per_day)
        VALUES ('Aarav Sharma', 25, 'male', 175.0, 70.0, 'moderate', 'muscle_gain', 'vegetarian', 4);
    """)
    user_id = cursor.lastrowid
    
    cursor.execute("""
        INSERT INTO user_preferences (user_id, preferred_region, preferred_cuisine, allergies, disliked_foods)
        VALUES (?, 'South Indian', 'South Indian', '[]', '[]');
    """, (user_id,))
    
    conn.commit()
    conn.close()
    
    print(f"Database seeded successfully at {db_path} with {len(df_ifct)} foods and {len(df_recipes)} recipes.")
    
    # Also generate seed.sql for PostgreSQL / SQLite deployment
    with open(seed_sql_path, "w", encoding="utf-8") as f:
        f.write("-- Seed SQL File for Personalized Indian Meal Recommendation System\n\n")
        for _, row in df_ifct.iterrows():
            f_name = clean_sql_str(row['food_name'])
            f_local = clean_sql_str(row['local_name'])
            f.write(f"INSERT INTO foods (food_id, food_name, scientific_name, local_name, food_group, region, energy_kcal, protein_g, carbohydrate_g, fat_g, fiber_g, sugar_g, calcium_mg, iron_mg, sodium_mg, potassium_mg) VALUES ('{row['food_id']}', '{f_name}', '{row['scientific_name']}', '{f_local}', '{row['food_group']}', '{row['region']}', {row['energy_kcal']}, {row['protein_g']}, {row['carbohydrate_g']}, {row['fat_g']}, {row['fiber_g']}, {row['sugar_g']}, {row['calcium_mg']}, {row['iron_mg']}, {row['sodium_mg']}, {row['potassium_mg']});\n")
            
        for _, row in df_recipes.iterrows():
            r_name = clean_sql_str(row['recipe_name'])
            r_ing = clean_sql_str(row['ingredients'])
            r_all = clean_sql_str(row['allergens'])
            f.write(f"INSERT INTO recipes (recipe_id, recipe_name, region, cuisine, meal_type, diet_type, serving_size_g, calories, protein_g, carbohydrates_g, fat_g, fiber_g, sugar_g, sodium_mg, ingredients, allergens) VALUES ({row['recipe_id']}, '{r_name}', '{row['region']}', '{row['cuisine']}', '{row['meal_type']}', '{row['diet_type']}', {row['serving_size_g']}, {row['calories']}, {row['protein_g']}, {row['carbohydrates_g']}, {row['fat_g']}, {row['fiber_g']}, {row['sugar_g']}, {row['sodium_mg']}, '{r_ing}', '{r_all}');\n")
            
    print(f"Saved seed SQL script to {seed_sql_path}.")

if __name__ == "__main__":
    seed_all()
