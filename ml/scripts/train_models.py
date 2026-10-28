"""
ML Model Training & Evaluation Script:
Trains StandardScaler, K-Means clustering, and KNN similarity model on processed Indian recipe data.
Saves model artifacts to ml/models/ directory.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import silhouette_score

def train_and_save_models():
    os.makedirs("ml/models", exist_ok=True)
    recipe_path = "ml/data/processed/recipes_processed.csv"
    
    if not os.path.exists(recipe_path):
        raise FileNotFoundError(f"Processed dataset not found at {recipe_path}. Run process_data.py first.")
        
    df = pd.read_csv(recipe_path)
    
    # Selected features for clustering and similarity matching
    feature_cols = ["calories", "protein_g", "carbohydrates_g", "fat_g", "fiber_g"]
    X = df[feature_cols].values
    
    print("--- 1. Feature Scaling ---")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("\n--- 2. K-Means Cluster Optimization ---")
    best_k = 4
    best_score = -1
    elbow_data = []
    
    for k in range(2, 8):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X_scaled)
        sil = silhouette_score(X_scaled, labels)
        wcss = km.inertia_
        elbow_data.append((k, wcss, sil))
        print(f"k = {k} | WCSS (Inertia): {wcss:.2f} | Silhouette Score: {sil:.4f}")
        if sil > best_score:
            best_score = sil
            best_k = k
            
    print(f"\nSelected optimal k = {best_k} (Silhouette Score: {best_score:.4f})")
    
    # Train final K-Means model
    kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)
    df["cluster"] = cluster_labels
    
    # Print cluster characteristics
    print("\n--- Cluster Nutritional Characteristics ---")
    cluster_summary = df.groupby("cluster")[feature_cols].mean()
    print(cluster_summary)
    
    print("\n--- 3. Training KNN Similarity Model ---")
    knn = NearestNeighbors(n_neighbors=min(10, len(df)), metric="euclidean")
    knn.fit(X_scaled)
    
    # Save model artifacts
    scaler_path = "ml/models/scaler.pkl"
    kmeans_path = "ml/models/kmeans.pkl"
    knn_path = "ml/models/knn.pkl"
    
    joblib.dump(scaler, scaler_path)
    joblib.dump(kmeans, kmeans_path)
    joblib.dump(knn, knn_path)
    
    print("\n--- Model Training & Persistence Complete ---")
    print(f"Saved scaler to {scaler_path}")
    print(f"Saved K-Means to {kmeans_path}")
    print(f"Saved KNN to {knn_path}")

if __name__ == "__main__":
    train_and_save_models()
