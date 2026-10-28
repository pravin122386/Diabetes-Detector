"""
Model Loader Singleton Module.
Loads joblib artifacts (scaler.pkl, kmeans.pkl, knn.pkl) from ml/models/ directory.
"""

import os
import joblib

class ModelLoader:
    _instance = None

    def __init__ (self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ml/models"))
        scaler_path = os.path.join(base_dir, "scaler.pkl")
        kmeans_path = os.path.join(base_dir, "kmeans.pkl")
        knn_path = os.path.join(base_dir, "knn.pkl")

        if not (os.path.exists(scaler_path) and os.path.exists(kmeans_path) and os.path.exists(knn_path)):
            raise FileNotFoundError("Model artifacts not found in ml/models/. Run ml/scripts/train_models.py first.")

        self.scaler = joblib.load(scaler_path)
        self.kmeans = joblib.load(kmeans_path)
        self.knn = joblib.load(knn_path)

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelLoader()
        return cls._instance

def get_ml_models():
    return ModelLoader.get_instance()
