# Data Directory Overview

This directory contains raw and processed datasets used for the **Personalized Indian Meal Recommendation System**.

## Data Architecture
- `raw/`: Unmodified raw datasets from scientific sources.
  - `ifct_2017_raw.csv`: Raw Indian Food Composition Tables 2017 from ICMR - National Institute of Nutrition (NIN).
  - `indb_recipes_raw.csv`: Recipe-level nutritional dataset based on Indian Nutrient Databank (INDB) composition standards.
- `processed/`: Cleaned, validated, and normalized datasets ready for ML feature extraction and FastAPI database seeding.
  - `ifct_processed.csv`: Validated ingredient composition records (45 items across 12 food groups).
  - `recipes_processed.csv`: Standardized Indian recipe records (40 regional dishes across North, South, East, West & Central India).

## Critical Rules & Provenance
1. **Source Integrity**: No nutritional values are fabricated or randomly generated. All data preserves original source values from IFCT 2017 and INDB.
2. **Entity Separation**: IFCT food composition data (raw ingredients per 100g) is kept distinct from INDB recipe-level data (complete dishes per serving).
3. **Hard Constraints**: Dietary preferences (Vegetarian, Vegan, Non-Vegetarian) and Allergens (Peanuts, Dairy, Gluten, Mustard, Tree Nuts, Eggs, Fish, Sesame) are explicitly cataloged for rule-based filtering.
