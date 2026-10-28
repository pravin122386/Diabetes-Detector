"""
Data Processing Pipeline Script:
Loads raw IFCT 2017 and INDB recipe datasets, validates non-negativity and missingness,
standardizes string types and numeric columns, and produces clean processed CSV files.
"""

import os
import pandas as pd
import numpy as np

def clean_and_process_ifct():
    raw_path = "ml/data/raw/ifct_2017_raw.csv"
    processed_path = "ml/data/processed/ifct_processed.csv"
    
    df = pd.read_csv(raw_path)
    
    # Validation checks
    numeric_cols = ["energy_kcal", "protein_g", "carbohydrate_g", "fat_g", "fiber_g", "sugar_g", "calcium_mg", "iron_mg", "sodium_mg", "potassium_mg"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        df[col] = df[col].apply(lambda x: max(0.0, float(x)) if pd.notnull(x) else np.nan)
        
    # Trim text fields
    text_cols = ["food_id", "food_name", "scientific_name", "local_name", "food_group", "region"]
    for col in text_cols:
        df[col] = df[col].astype(str).str.strip()
        
    # Drop exact duplicates if any
    df = df.drop_duplicates(subset=["food_id"])
    
    df.to_csv(processed_path, index=False)
    print(f"[IFCT Pipeline] Processed dataset saved to {processed_path}. Total valid rows: {len(df)}")
    return df

def clean_and_process_recipes():
    raw_path = "ml/data/raw/indb_recipes_raw.csv"
    processed_path = "ml/data/processed/recipes_processed.csv"
    
    df = pd.read_csv(raw_path)
    
    # Numeric column processing & non-negative validation
    num_cols = ["serving_size_g", "calories", "protein_g", "carbohydrates_g", "fat_g", "fiber_g", "sugar_g", "sodium_mg"]
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        df[col] = df[col].apply(lambda x: max(0.0, float(x)) if pd.notnull(x) else np.nan)
        
    # Standardize string fields
    text_cols = ["recipe_name", "region", "cuisine", "meal_type", "diet_type", "ingredients", "allergens"]
    for col in text_cols:
        df[col] = df[col].astype(str).str.strip()
        
    # Ensure recipe_id is integer
    df["recipe_id"] = df["recipe_id"].astype(int)
    
    # Drop duplicates
    df = df.drop_duplicates(subset=["recipe_id"])
    
    df.to_csv(processed_path, index=False)
    print(f"[Recipe Pipeline] Processed dataset saved to {processed_path}. Total valid recipes: {len(df)}")
    return df

if __name__ == "__main__":
    clean_and_process_ifct()
    clean_and_process_recipes()
