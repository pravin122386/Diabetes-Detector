"""
Recommendation Ranking Service.
Calculates transparent recommendation scores combining KNN distance similarity,
regional/cuisine preference alignment, user feedback history, and meal context.
"""

from typing import Dict, Any, List
from backend.app.models.database_models import RecipeDB

def calculate_recommendation_score(
    recipe: RecipeDB,
    knn_distance: float,
    preferred_region: str = "All India",
    preferred_cuisine: str = "All India",
    feedback_history: Dict[int, Dict[str, Any]] = None,
    weights: Dict[str, float] = None
) -> float:
    """
    Transparent scoring system:
    Final Score = W_sim * SimScore + W_pref * PrefScore + W_feed * FeedScore + W_reg * RegScore
    """
    if weights is None:
        weights = {
            "similarity": 0.60,
            "preference": 0.20,
            "feedback": 0.10,
            "region": 0.10
        }

    # 1. Similarity Score (Inverse of Euclidean Distance)
    # Distance of 0 gives score 1.0; distance of 3.0 or more scales towards 0.0
    sim_score = max(0.0, 1.0 - (knn_distance / 3.0))

    # 2. Preference Score (Cuisine match)
    pref_score = 0.5
    p_cuis = str(preferred_cuisine).lower().strip()
    r_cuis = str(recipe.cuisine).lower().strip()
    if p_cuis != "all india" and (p_cuis in r_cuis or r_cuis in p_cuis):
        pref_score = 1.0

    # 3. Regional Match Score
    reg_score = 0.5
    p_reg = str(preferred_region).lower().strip()
    r_reg = str(recipe.region).lower().strip()
    if p_reg != "all india" and (p_reg in r_reg or r_reg in p_reg):
        reg_score = 1.0

    # 4. Feedback Score
    feed_score = 0.5
    if feedback_history and recipe.recipe_id in feedback_history:
        fb = feedback_history[recipe.recipe_id]
        if fb.get("liked"):
            feed_score += 0.4
        if fb.get("rating"):
            feed_score += (fb["rating"] - 3) * 0.1
        if fb.get("replaced"):
            feed_score -= 0.5

    feed_score = max(0.0, min(1.0, feed_score))

    # Weighted Sum
    final_score = (
        weights["similarity"] * sim_score +
        weights["preference"] * pref_score +
        weights["feedback"] * feed_score +
        weights["region"] * reg_score
    )

    return round(float(final_score), 4)
