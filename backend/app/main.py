"""
FastAPI Application Entry Point.
Personalized Indian Meal Recommendation System Backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import engine, Base
from backend.app.api import users, nutrition, recipes, recommendations, feedback

# Initialize Database Schema if not created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personalized Indian Meal Recommendation API",
    description="Machine Learning Powered Personalized Indian Meal Recommendation System using IFCT 2017 & INDB Datasets.",
    version="1.0.0"
)

# CORS Configuration for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(users.router)
app.include_router(nutrition.router)
app.include_router(recipes.router)
app.include_router(recommendations.router)
app.include_router(feedback.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Personalized Indian Meal Recommendation API",
        "version": "1.0.0",
        "data_sources": {
            "nutritional_foundation": "IFCT 2017 (ICMR - National Institute of Nutrition)",
            "recipe_databank": "INDB (Indian Nutrient Databank)"
        },
        "ml_models": ["StandardScaler", "K-Means (k=3)", "K-Nearest Neighbors (k=5)"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
