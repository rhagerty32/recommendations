from flask import Flask, jsonify, request
import requests
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Manually handle CORS
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Load .sav models
collab_model = joblib.load("knn_model.sav")

@app.route('/score', methods=['POST', 'OPTIONS'])
def score():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    print("Received request:", request.json)
    
    # Validate request payload
    try:
        input_data = request.json  # Assumes React sends the correct structure
    except Exception as e:
        return jsonify({"error": "Invalid input format", "details": str(e)}), 400

    # Azure ML settings
    azure_url = 'http://1c34af2a-60de-4d1d-9101-7ccca2825e0f.eastus2.azurecontainer.io/score'  # Adjust to correct scoring URL
    azure_api_key = 't6DQEVBHGxabbelGBY3yiaKKDL8fpkix'

    # Assuming you have a dictionary or DataFrame mapping personId to feature vectors
    # user_id = input_data["Inputs"]["input1"][0]["personId"]
    # user_id = -8845298781299428018
    
    # # Load the user features from a CSV or precomputed DataFrame
    # user_features_df = pd.read_csv("users_interactions.csv", index_col="personId")

    # # Fetch the correct feature vector for this user
    # try:
    #     user_vector = user_features_df.loc[user_id]
    # except KeyError:
    #     return jsonify({"error": f"No feature vector found for user {user_id}"}), 400

    # # Remove non-numeric columns (like eventType, timestamp, etc.)
    # user_vector = user_vector.select_dtypes(include=[np.number])
    
    # # Ensure user_vector has the same feature columns as training data
    # missing_cols = set(collab_model._fit_X.columns) - set(user_vector.index)
    # for col in missing_cols:
    #     user_vector[col] = 0  # Assign 0 to missing columns

    # # Reorder columns to match training data
    # user_vector = user_vector[collab_model._fit_X.columns]

    # if user_vector.empty:
    #     return jsonify({"error": f"No numeric feature vector found for user {user_id}"}), 400

    # # Convert user vector to NumPy array and reshape it to (1, -1)
    # user_vector = np.array(user_vector).reshape(1, -1)

    # print("User vector shape:", user_vector.shape)
    # print("Training data shape:", collab_model._fit_X.shape)

    # Get nearest neighbors
    # distances, indices = collab_model.kneighbors(user_vector, n_neighbors=5)

    # # Convert to list for JSON response
    # collab_recs = indices.tolist()[0]


    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {azure_api_key}'
    }

    try:
        azure_response = requests.post(azure_url, json=input_data, headers=headers)
        azure_response.raise_for_status()  # Raise an error for non-2xx responses
        azure_result = azure_response.json()
        print("Azure response:", azure_result)
        return jsonify(azure_result)
    except requests.exceptions.RequestException as e:
        print(f"Azure ML request failed: {e}")
        return jsonify({"error": "Azure ML request failed", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)