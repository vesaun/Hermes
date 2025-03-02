import os
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import openai
import re

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin using your service account JSON file.
# Update the path below to match your environment.
cred = credentials.Certificate("D:\\Yuri\\Hackathon\\HACKCU2025\\Hermes\\hermes_project\\hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load the embedding model for text vectorization.
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Set up your OpenAI API key.
openai.api_key = os.environ.get("OPENAI_API_KEY")  # Ensure you have this in your environment variables

def vectorize_profile(profile_text: str) -> np.ndarray:
    """Convert profile text into a vector."""
    return embedding_model.encode(profile_text)

def get_all_user_profiles():
    """Fetch all user profiles from Firestore and build a simple interests string for each."""
    users_ref = db.collection("users")
    users = users_ref.stream()
    profiles = []
    for user in users:
        user_dict = user.to_dict()
        # Concatenate fields that represent interests (adjust fields as needed)
        interests = " ".join([
            user_dict.get("major", ""),
            user_dict.get("fraternity", ""),
            user_dict.get("hometown_city", ""),
            user_dict.get("hometown_state", "")
        ])
        profiles.append({
            "id": user.id,
            "firstname": user_dict.get("firstname"),
            "lastname": user_dict.get("lastname"),
            "interests_text": interests,
            "raw": user_dict  # Raw info if you want to include additional details
        })
    return profiles

def find_top_matches(query_vector, profiles, top_k=5):
    """Compute cosine similarity and return the top k matching profiles."""
    profile_vectors = [vectorize_profile(profile["interests_text"]) for profile in profiles]
    sims = cosine_similarity([query_vector], profile_vectors)[0]
    # Get indices of the top k matches
    top_indices = np.argsort(sims)[::-1][:top_k]
    top_matches = []
    for idx in top_indices:
        top_matches.append({
            "profile": profiles[idx],
            "similarity": float(sims[idx])
        })
    return top_matches

def generate_match_summary(matches):
    """
    Build a prompt from the top matches and use an LLM to generate a summary.
    Adjust the prompt as needed.
    """
    prompt_lines = ["I found the following 5 users with similar interests:"]
    for i, match in enumerate(matches, 1):
        profile = match["profile"]
        line = f"{i}. {profile['firstname']} {profile['lastname']} - Interests: {profile['interests_text']}"
        prompt_lines.append(line)
    prompt_lines.append("\nGenerate a brief summary describing why these users might be a great match based on their profiles.")
    prompt = "\n".join(prompt_lines)

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
        temperature=0.7,
        n=1,
        stop=None
    )
    summary = response.choices[0].text.strip()
    return summary

@app.route("/api/findMatches", methods=["POST"])
def find_matches():
    """
    Expects a JSON payload with a "profile" key that contains a text summary
    of the user's interests. Returns the top 5 matches and a generated summary.
    """
    data = request.get_json()
    if not data or "profile" not in data:
        return jsonify({"error": "Missing 'profile' field in request."}), 400

    query_text = data["profile"]
    query_vector = vectorize_profile(query_text)
    profiles = get_all_user_profiles()
    top_matches = find_top_matches(query_vector, profiles, top_k=5)
    summary_message = generate_match_summary(top_matches)
    result = {
        "top_matches": top_matches,
        "summary": summary_message
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
