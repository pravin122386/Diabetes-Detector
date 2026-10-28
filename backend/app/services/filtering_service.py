"""
Rule-Based Hard Constraint Filtering Service.
Enforces strict medical/safety hard filtering for Diet Type, Allergens, Disliked Foods, and Meal Types.
"""

from typing import List
from backend.app.models.database_models import RecipeDB

ALLERGEN_KEYWORD_MAP = {
    "peanuts": ["peanut", "groundnut", "moongphali"],
    "tree nuts": ["almond", "cashew", "walnut", "badam", "kaju", "pista"],
    "dairy": ["milk", "curd", "dahi", "paneer", "ghee", "butter", "cream", "cheese", "thayir"],
    "milk": ["milk", "curd", "dahi", "paneer", "ghee", "butter", "cream", "cheese", "thayir"],
    "gluten": ["wheat", "maida", "bhatura", "pav", "roti", "paratha", "thepla", "luchi", "oats", "gehun"],
    "wheat": ["wheat", "maida", "bhatura", "pav", "roti", "paratha", "thepla", "luchi", "gehun"],
    "eggs": ["egg", "anda", "muttai"],
    "mustard": ["mustard", "sarson", "rai"],
    "fish": ["fish", "mackerel", "rohu", "kingfish", "bangda", "meen", "machher"],
    "seafood": ["fish", "prawn", "shrimp", "mackerel", "rohu", "eral", "jhinga"],
    "sesame": ["sesame", "til", "ellu"]
}

NON_VEG_KEYWORDS = ["chicken", "mutton", "goat", "fish", "prawn", "shrimp", "mackerel", "rohu", "meat", "egg", "anda", "muttai", "iraachi", "kozhi"]
NON_VEGAN_KEYWORDS = NON_VEG_KEYWORDS + ["milk", "curd", "dahi", "paneer", "ghee", "butter", "cream", "cheese", "honey", "thayir", "paal"]

def filter_diet(recipes: List[RecipeDB], diet_type: str) -> List[RecipeDB]:
    dt = str(diet_type).lower().strip()
    filtered = []
    
    for r in recipes:
        r_dt = str(r.diet_type).lower().strip()
        ing_text = (str(r.ingredients) + " " + str(r.recipe_name)).lower()
        
        if dt == "vegan":
            # Must be labeled Vegan OR contain zero non-vegan keywords
            if r_dt == "vegan" and not any(kw in ing_text for kw in NON_VEGAN_KEYWORDS):
                filtered.append(r)
        elif dt == "vegetarian":
            # Must NOT contain non-vegetarian keywords
            if r_dt in ["vegetarian", "vegan"] and not any(kw in ing_text for kw in NON_VEG_KEYWORDS):
                filtered.append(r)
        else:
            # Non-Vegetarian accepts all
            filtered.append(r)
            
    return filtered

def filter_allergens(recipes: List[RecipeDB], user_allergies: List[str]) -> List[RecipeDB]:
    if not user_allergies:
        return recipes
        
    cleaned_allergies = [a.lower().strip() for a in user_allergies if a]
    if not cleaned_allergies:
        return recipes
        
    filtered = []
    for r in recipes:
        ing_text = (str(r.ingredients) + " " + str(r.recipe_name) + " " + str(r.allergens)).lower()
        has_allergen = False
        
        for alg in cleaned_allergies:
            # Check explicit mapping or raw string match
            keywords = ALLERGEN_KEYWORD_MAP.get(alg, [alg])
            if any(kw in ing_text for kw in keywords):
                has_allergen = True
                break
                
        if not has_allergen:
            filtered.append(r)
            
    return filtered

def filter_disliked(recipes: List[RecipeDB], disliked_foods: List[str]) -> List[RecipeDB]:
    if not disliked_foods:
        return recipes
        
    cleaned_disliked = [d.lower().strip() for d in disliked_foods if d]
    if not cleaned_disliked:
        return recipes
        
    filtered = []
    for r in recipes:
        ing_text = (str(r.ingredients) + " " + str(r.recipe_name)).lower()
        if not any(df in ing_text for df in cleaned_disliked):
            filtered.append(r)
            
    return filtered

def filter_meal_type(recipes: List[RecipeDB], meal_type: str) -> List[RecipeDB]:
    mt = str(meal_type).lower().strip()
    if not mt or mt == "all":
        return recipes
        
    filtered = []
    for r in recipes:
        r_mt = str(r.meal_type).lower().strip()
        if mt in r_mt or r_mt in mt or r_mt == "all india":
            filtered.append(r)
            
    # Fallback to all candidate recipes if meal type filter leaves zero options
    return filtered if len(filtered) > 0 else recipes
