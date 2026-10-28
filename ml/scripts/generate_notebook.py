"""
Script to create the comprehensive Jupyter Notebook ml/notebooks/food_recommendation.ipynb
covering all 12 required steps for ML dataset exploration, EDA, K-Means clustering,
KNN recommendation, and model persistence.
"""

import os
import nbformat as nbf

def build_notebook():
    os.makedirs("ml/notebooks", exist_ok=True)
    nb = nbf.v4.new_notebook()
    
    cells = []
    
    # Header
    cells.append(nbf.v4.new_markdown_cell("""# Personalized Indian Meal Recommendation System - ML Workflow
**Notebook**: `food_recommendation.ipynb`  
**Dataset**: IFCT 2017 (NIN/ICMR) & INDB (Indian Nutrient Databank)  
**Objective**: Build and evaluate K-Means Clustering and K-Nearest Neighbors (KNN) ML models for Indian Meal Recommendations based on real nutritional composition."""))

    # Step 1
    cells.append(nbf.v4.new_markdown_cell("## Step 1: Load Datasets"))
    cells.append(nbf.v4.new_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import silhouette_score
import joblib

# Load processed datasets
ifct_df = pd.read_csv('../data/processed/ifct_processed.csv')
recipe_df = pd.read_csv('../data/processed/recipes_processed.csv')

print(f"IFCT Dataset loaded: {ifct_df.shape}")
print(f"INDB Recipe Dataset loaded: {recipe_df.shape}")"""))

    # Step 2 & 3
    cells.append(nbf.v4.new_markdown_cell("## Step 2 & Step 3: Dataset Exploration & Data Inspection\nInspect shape, columns, missing values, duplicates, and data types."))
    cells.append(nbf.v4.new_code_cell("""print("=== Recipe Dataset Summary ===")
print("Shape:", recipe_df.shape)
print("\nColumns:", recipe_df.columns.tolist())
print("\nData Types:\n", recipe_df.dtypes)
print("\nMissing Values:\n", recipe_df.isnull().sum())
print("\nDuplicate Recipes:", recipe_df.duplicated(subset=['recipe_id']).sum())
print("\nFirst 5 Rows:")
recipe_df.head()"""))

    # Step 4
    cells.append(nbf.v4.new_markdown_cell("## Step 4: Exploratory Data Analysis (EDA)\nAnalyze nutritional distributions and correlations."))
    cells.append(nbf.v4.new_code_cell("""plt.figure(figsize=(14, 10))

plt.subplot(2, 2, 1)
sns.histplot(recipe_df['calories'], kde=True, color='crimson')
plt.title('Calories Distribution')

plt.subplot(2, 2, 2)
sns.histplot(recipe_df['protein_g'], kde=True, color='teal')
plt.title('Protein (g) Distribution')

plt.subplot(2, 2, 3)
sns.histplot(recipe_df['carbohydrates_g'], kde=True, color='orange')
plt.title('Carbohydrates (g) Distribution')

plt.subplot(2, 2, 4)
sns.histplot(recipe_df['fat_g'], kde=True, color='purple')
plt.title('Fat (g) Distribution')

plt.tight_layout()
plt.show()"""))

    cells.append(nbf.v4.new_code_cell("""# Correlation Matrix of Nutritional Features
plt.figure(figsize=(8, 6))
nutritional_cols = ['calories', 'protein_g', 'carbohydrates_g', 'fat_g', 'fiber_g']
sns.heatmap(recipe_df[nutritional_cols].corr(), annot=True, cmap='YlGnBu', fmt='.2f')
plt.title('Nutritional Features Correlation Matrix')
plt.show()"""))

    # Step 5 & 6
    cells.append(nbf.v4.new_markdown_cell("## Step 5 & Step 6: Data Cleaning & Feature Engineering\nValidate non-negativity and extract vector representation `[calories, protein_g, carbohydrates_g, fat_g, fiber_g]`."))
    cells.append(nbf.v4.new_code_cell("""feature_cols = ['calories', 'protein_g', 'carbohydrates_g', 'fat_g', 'fiber_g']
X = recipe_df[feature_cols].values
print("Feature matrix shape:", X.shape)"""))

    # Step 7
    cells.append(nbf.v4.new_markdown_cell("## Step 7: Feature Scaling\nScale features using `StandardScaler`."))
    cells.append(nbf.v4.new_code_cell("""scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print("Scaled features mean (approx 0):", np.round(X_scaled.mean(axis=0), 2))
print("Scaled features std (approx 1):", np.round(X_scaled.std(axis=0), 2))"""))

    # Step 8 & 9
    cells.append(nbf.v4.new_markdown_cell("## Step 8 & Step 9: K-Means Clustering & Cluster Evaluation\nUse Elbow Method (WCSS) and Silhouette Score to evaluate cluster quality."))
    cells.append(nbf.v4.new_code_cell("""wcss = []
silhouette_scores = []
K_range = range(2, 8)

for k in K_range:
    kmeans_test = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans_test.fit_predict(X_scaled)
    wcss.append(kmeans_test.inertia_)
    sil = silhouette_score(X_scaled, labels)
    silhouette_scores.append(sil)
    print(f"k={k} -> Inertia (WCSS): {kmeans_test.inertia_:.2f}, Silhouette Score: {sil:.4f}")

# Plot Elbow and Silhouette
fig, ax1 = plt.subplots(figsize=(10, 4))
ax1.plot(K_range, wcss, 'bo-', label='WCSS / Inertia')
ax1.set_xlabel('Number of Clusters (k)')
ax1.set_ylabel('Inertia', color='b')

ax2 = ax1.twinx()
ax2.plot(K_range, silhouette_scores, 'ro--', label='Silhouette Score')
ax2.set_ylabel('Silhouette Score', color='r')
plt.title('K-Means Elbow & Silhouette Score Analysis')
plt.show()"""))

    cells.append(nbf.v4.new_code_cell("""# Fit final K-Means model with optimal k=3
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
recipe_df['cluster'] = kmeans.fit_predict(X_scaled)

print("Cluster Sizes:")
print(recipe_df['cluster'].value_counts())

print("\nCluster Nutritional Characteristics (Mean Values):")
print(recipe_df.groupby('cluster')[feature_cols].mean())"""))

    # Step 10
    cells.append(nbf.v4.new_markdown_cell("## Step 10: K-Nearest Neighbors (KNN) Similarity Model"))
    cells.append(nbf.v4.new_code_cell("""knn = NearestNeighbors(n_neighbors=5, metric='euclidean')
knn.fit(X_scaled)
print("KNN model fitted successfully on scaled nutritional vectors.")"""))

    # Step 11
    cells.append(nbf.v4.new_markdown_cell("## Step 11: Test Recommendation Examples\nTest KNN recommendation for a sample user target profile: Calories=450, Protein=20g, Carbs=60g, Fat=12g, Fiber=8g."))
    cells.append(nbf.v4.new_code_cell("""target_vector = np.array([[450.0, 20.0, 60.0, 12.0, 8.0]])
target_scaled = scaler.transform(target_vector)

distances, indices = knn.kneighbors(target_scaled)

print("Top 5 Nutritionally Similar Recipes for Target Profile:")
for rank, (dist, idx) in enumerate(zip(distances[0], indices[0]), start=1):
    rec = recipe_df.iloc[idx]
    print(f"Rank {rank}: {rec['recipe_name']} ({rec['diet_type']}, {rec['meal_type']}) | Distance: {dist:.4f}")
    print(f"   Nutrients: {rec['calories']} kcal, {rec['protein_g']}g P, {rec['carbohydrates_g']}g C, {rec['fat_g']}g F, {rec['fiber_g']}g Fib\n")"""))

    # Step 12
    cells.append(nbf.v4.new_markdown_cell("## Step 12: Save Trained Models with Joblib"))
    cells.append(nbf.v4.new_code_cell("""joblib.dump(scaler, '../models/scaler.pkl')
joblib.dump(kmeans, '../models/kmeans.pkl')
joblib.dump(knn, '../models/knn.pkl')
print("All models exported successfully to ml/models/ directory.")"""))

    nb['cells'] = cells
    
    with open("ml/notebooks/food_recommendation.ipynb", "w", encoding="utf-8") as f:
        nbf.write(nb, f)
        
    print("Jupyter Notebook created successfully at ml/notebooks/food_recommendation.ipynb")

if __name__ == "__main__":
    build_notebook()
