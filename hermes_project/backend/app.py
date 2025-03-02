# import flask
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from initializeApp import "firebase/app";
import os
import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from dataclasses import dataclass
import re


import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import openai

app = Flask(__name__)
CORS(app)
#Yuri's PATH
# D:\Yuri\Hackathon\HACKCU2025\Hermes\hermes_project\hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json
#VESAUN's PATH
#/Users/vesaunshrestha/Documents/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json

#LOGAN's PATH
#/Users/logan/OneDrive/Desktop/hackcu/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json
cred = credentials.Certificate("D:\Yuri\Hackathon\HACKCU2025\Hermes\hermes_project\hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
# Load the embedding model for text vectorization.
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Set up your OpenAI API key.
openai.api_key = os.environ.get("OPENAI_API_KEY")
@dataclass
class UserData:
    first_name: str
    last_name: str
    hometown_city: str
    hometown_state: str
    gpa: float
    instagram_username: str
    major: str
    active: bool
    fraternity: str

def clean_user_data(user_dict):
    # Create a UserData instance using raw Firestore data.
    return UserData(
        first_name=user_dict.get("firstname", ""),
        last_name=user_dict.get("lastname", ""),
        hometown_city=user_dict.get("hometown_city", ""),
        hometown_state=user_dict.get("hometown_state", ""),
        gpa=float(user_dict.get("gpa", 0.0)),
        instagram_username=user_dict.get("instagram_username", ""),
        major=user_dict.get("major", ""),
        active=user_dict.get("active", False),
        fraternity=user_dict.get("fraternity", "")
    )

def to_clean_dict(user_data: UserData):
    # Convert the UserData instance into a dictionary with keys matching the SQL table.
    return {
        "First Name": user_data.first_name,
        "Last Name": user_data.last_name,
        "Hometown City": user_data.hometown_city,
        "Hometown State": user_data.hometown_state,
        "GPA": user_data.gpa,
        "Instagram": user_data.instagram_username,
        "Major": user_data.major,
        "Active": user_data.active,
        "Fraternity": user_data.fraternity
    }

@app.route("/api/findUserData/<email>", methods=["GET"])
def findUserData(email):
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).stream()

    user_data_list = [to_clean_dict(clean_user_data(user.to_dict())) for user in query]

    if not user_data_list:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_data_list)

@app.route("/api/getFratData", methods=["GET"])
def getFratData():
    frats_ref = db.collection("fraternities")
    frats = frats_ref.stream()

    frat_data = []
    for frat in frats:
        frat_dict = frat.to_dict()
        frat_data.append({
            "name": frat_dict.get("name"),
            "chapter": frat_dict.get("chapter"),
            "address": frat_dict.get("address"),
            "year_founded": frat_dict.get("year_founded"),
            "member_count": frat_dict.get("member_count"),
            "instagram_username": frat_dict.get("instagram_username"),
            "logoImage": frat_dict.get("logoImage"),
            "houseImage": frat_dict.get("houseImage")
        })

    return jsonify(frat_data)

@app.route("/api/getUserData", methods=["GET"])
def getUserData():
    users_ref = db.collection("users")
    users = users_ref.stream()

    user_data = []

    for user in users:
        user_dict = user.to_dict()
        user_data.append({
            "firstname": user_dict.get("firstname"),
            "lastname": user_dict.get("lastname"),
            "hometown": f"{user_dict.get('hometown_city')}, {user_dict.get('hometown_state')}",
            "major": user_dict.get("major"),
            "highschool": user_dict.get("highschool"),
            "gpa": user_dict.get("gpa")
        })

    return jsonify(user_data)

def add_user(data):
    existing_user_ref = db.collection("users").where("email", "==", data["email"]).limit(1).get()

    # If the email exists, return an error message
    if existing_user_ref:
        return {"error": "Email already in use."}
    
    # If email does not exist, add the new user
    doc_ref = db.collection("users").add(
        {
            "email": data["email"],
            "firstname": data["first_name"],
            "lastname": data["last_name"],
            "hometown_state": data["hometown_state"],
            "hometown_city": data["hometown_city"],
            "instagram_username": data["instagram_handle"],
            "major": data["major"],
            "active": data["is_active"],
            "fraternity": data["fraternity"],
            "highschool": data["highschool"],
            "gpa": data["gpa"]
        }
    )

    return {"success": "User added successfully."}

def validate_signup(data):
    errors = {}
    email = data.get("email", "")
    # password = data.get("password", "")
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    hometown_state = data.get("hometown_state", "")
    hometown_city = data.get("hometown_city", "")
    instagram_handle = data.get("instagram_handle", "")
    highschool = data.get("highschool", "")
    gpa = data.get("gpa", None)
    major = data.get("major", "")
    is_active = data.get("is_active", False)
    fraternity = data.get("fraternity", "")

  # Validate email
    if not email:
        errors["email"] = "Email is required"
    elif not re.match(r'\S+@\S+\.\S+', email):
        errors["email"] = "Email is invalid"

    # Validate password
    # if not password:
    #     errors["password"] = "Password is required"
    # elif len(password) < 6:
    #     errors["password"] = "Password must be at least 6 characters"

    # Validate name (first and last required)
    if not first_name or not last_name:
        errors["name"] = "First and last name are required"

    # Validate hometown details
    if not hometown_state or not hometown_city:
        errors["hometown"] = "Hometown is required"

    # Validate high school
    if not highschool:
        errors["highschool"] = "High school is required"

    # Validate GPA if provided
    if gpa:
        try:
            gpa_value = float(gpa)
            if gpa_value < 0 or gpa_value > 4.0:
                errors["gpa"] = "GPA must be a number between 0 and 4.0"
        except ValueError:
            errors["gpa"] = "GPA must be a valid number"

    return errors

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    errors = validate_signup(data)
    if errors:
        return jsonify({"errors": errors}), 400

    # For demonstration, we'll just print the data.
    # In a production scenario, you'd save the data to a database,
    # hash the password, and perform any additional business logic.
    print("Form submitted:", data)
    result = add_user(data)
    if "error" in result:
        return result, 400
    else:
        return result, 200








# ----------------------------
# New LLM Matchmaking Endpoint
# ----------------------------

def vectorize_profile(profile_text: str) -> np.ndarray:
    """Convert profile text into a vector using the embedding model."""
    return embedding_model.encode(profile_text)

def get_all_user_profiles():
    """Retrieve all user profiles from Firestore and build an interests string."""
    users_ref = db.collection("users")
    users = users_ref.stream()
    profiles = []
    for user in users:
        user_dict = user.to_dict()
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
            "raw": user_dict
        })
    return profiles

def find_top_matches(query_vector, profiles, top_k=5):
    """Find the top k matching profiles using cosine similarity."""
    profile_vectors = [vectorize_profile(profile["interests_text"]) for profile in profiles]
    sims = cosine_similarity([query_vector], profile_vectors)[0]
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
    Generate a summary description using the new ChatCompletion API.
    """
    prompt_lines = ["I found the following 5 users with similar interests:"]
    for i, match in enumerate(matches, 1):
        profile = match["profile"]
        line = f"{i}. {profile['firstname']} {profile['lastname']} - Interests: {profile['interests_text']}"
        prompt_lines.append(line)
    prompt_lines.append("\nGenerate a brief summary describing why these users might be a great match based on their profiles.")
    prompt = "\n".join(prompt_lines)

    messages = [
        {"role": "system", "content": "You are a helpful matchmaking assistant."},
        {"role": "user", "content": prompt}
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=150,
        temperature=0.7,
    )
    summary = response.choices[0].message.content.strip()
    return summary

@app.route("/api/findMatches", methods=["POST"])
def find_matches():
    """
    Expects a JSON payload with a "profile" key containing a summary of the user's interests.
    Returns the top 5 matching profiles and an LLM-generated summary.
    """
    data = request.get_json()
    if not data or "profile" not in data:
        return jsonify({"error": "Missing 'profile' field in request."}), 400

    query_text = data["profile"]
    query_vector = vectorize_profile(query_text)
    profiles = get_all_user_profiles()
    top_matches = find_top_matches(query_vector, profiles, top_k=9)
    summary_message = generate_match_summary(top_matches)
    result = {
        "top_matches": top_matches,
        "summary": summary_message
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
