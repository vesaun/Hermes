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
# import pymysql

# Configure your database connection details via environment variables or hard-code (not recommended for production)
# DB_HOST = os.environ.get("DB_HOST", "localhost")
# DB_USER = os.environ.get("DB_USER", "your_db_username")
# DB_PASS = os.environ.get("DB_PASS", "your_db_password")
# DB_NAME = os.environ.get("DB_NAME", "users_db")



import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import openai

app = Flask(__name__)
# CORS(app)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

# CORS(app, resources={r"/api/*": {"origins": "*"}})

#Yuri's PATH
# D:\Yuri\Hackathon\HACKCU2025\Hermes\hermes_project\hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json
#VESAUN's PATH
#/Users/vesaunshrestha/Documents/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json

#LOGAN's PATH
# /Users/logan/OneDrive/Desktop/hackcu/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json
cred = credentials.Certificate("firebase-key.json")
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
    frats_ref = db.collection("fraternities").stream()
    frat_data = []

    for frat in frats_ref:
        frat_dict = frat.to_dict()
        frat_data.append({
            "name": frat_dict.get("name", ""),  # <-- always provide a default
            "chapter": frat_dict.get("chapter", ""),  # <-- fix KeyError by giving default ""
            "address": frat_dict.get("address", ""),
            "year_founded": frat_dict.get("year_founded", ""),
            "member_count": frat_dict.get("member_count", 0),
            "instagram_username": frat_dict.get("instagram_username", ""),
            "logoImage": frat_dict.get("logoImage", ""),
            "houseImage": frat_dict.get("houseImage", "")
        })

    return jsonify(frat_data)


@app.route("/api/getUserData", methods=["GET"])
def getUserData():
    users_ref = db.collection("users").stream()
    user_data = [{
        "email": user.get("email"),
        "firstname": user.get("firstname"),
        "lastname": user.get("lastname"),
        "phone_number": user.get("phone_number"),
        "birthday": user.get("birthday"),
        "hometown_address": user.get("hometown_address"),
        "hometown_city": user.get("hometown_city"),
        "hometown_state": user.get("hometown_state"),
        "hometown_zip": user.get("hometown_zip"),
        "hometown_country": user.get("hometown_country"),
        "instagram_username": user.get("instagram_username"),
        "highschool": user.get("highschool"),
        "grad_year": user.get("grad_year"),
        "gpa": user.get("gpa"),
        "major": user.get("major"),
        "is_active": user.get("is_active"),
        "fraternity": user.get("fraternity"),
        "signed_cob_form": user.get("signed_cob_form"),
        "hs_activities": user.get("hs_activities"),
        "hs_accomplishments": user.get("hs_accomplishments"),
        "rush_interest": user.get("rush_interest"),
        "headshot": user.get("headshot")
    } for user in users_ref]
    return jsonify(user_data)

def add_user(data):
    existing_user_ref = db.collection("users").where("email", "==", data.get("email", "")).limit(1).get()
    if existing_user_ref:
        return {"error": "Email already in use."}
    db.collection("users").add({
        "email": data.get("email", ""),
        "firstname": data.get("first_name", ""),
        "lastname": data.get("last_name", ""),
        "phone_number": data.get("phone_number", ""),
        "birthday": data.get("birthday", ""),
        "hometown_state": data.get("hometown_state", ""),
        "hometown_city": data.get("hometown_city", ""),
        "hometown_address": data.get("hometown_address", ""),
        "hometown_zip": data.get("hometown_zip", ""),
        "hometown_country": data.get("hometown_country", ""),
        "instagram_username": data.get("instagram_username", ""),
        "highschool": data.get("highschool", ""),
        "grad_year": data.get("grad_year", ""),
        "gpa": data.get("gpa", ""),
        "major": data.get("major", ""),
        "is_active": data.get("is_active", False),
        "fraternity": data.get("fraternity", ""),
        "signed_cob_form": data.get("signed_cob_form", ""),
        "hs_activities": data.get("hs_activities", ""),
        "hs_accomplishments": data.get("hs_accomplishments", ""),
        "rush_interest": data.get("rush_interest", ""),
        "headshot": data.get("headshot", "")
    })
    return {"success": "User added successfully."}

def validate_signup(data):
    errors = {}

    email = data.get("email", "")
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    phone_number = data.get("phone_number", "")
    birthday = data.get("birthday", "")
    hometown_city = data.get("hometown_city", "")
    hometown_state = data.get("hometown_state", "")
    hometown_address = data.get("hometown_address", "")
    hometown_zip = data.get("hometown_zip", "")
    hometown_country = data.get("hometown_country", "")
    instagram_username = data.get("instagram_username", "")
    highschool = data.get("highschool", "")
    grad_year = data.get("grad_year", "")
    gpa = data.get("gpa", None)
    major = data.get("major", "")
    is_active = data.get("is_active", False)
    fraternity = data.get("fraternity", "")
    signed_cob_form = data.get("signed_cob_form", "")
    hs_activities = data.get("hs_activities", "")
    hs_accomplishments = data.get("hs_accomplishments", "")
    rush_interest = data.get("rush_interest", "")
    headshot = data.get("headshot", "")

    # Email
    if not email:
        errors["email"] = "Email is required"
    elif not re.match(r'\S+@\S+\.\S+', email):
        errors["email"] = "Email is invalid"

    # Name
    if not first_name or not last_name:
        errors["name"] = "First and last name are required"

    # Phone number
    if not phone_number:
        errors["phone_number"] = "Phone number is required"

    # Birthday
    if not birthday:
        errors["birthday"] = "Birthday is required"

    # Hometown
    if not hometown_city or not hometown_state:
        errors["hometown"] = "Hometown is required"

    # Address
    if not hometown_address or not hometown_zip or not hometown_country:
        errors["address"] = "Complete home address is required"

    # High school
    if not highschool:
        errors["highschool"] = "High school is required"

    # Graduation year
    if not grad_year:
        errors["grad_year"] = "Graduation year is required"

    # GPA
    if gpa:
        try:
            gpa_value = float(gpa)
            if gpa_value < 0 or gpa_value > 5.0:
                errors["gpa"] = "GPA must be a number between 0 and 4.0"
        except ValueError:
            errors["gpa"] = "GPA must be a valid number"

    # COB Form
    if not signed_cob_form:
        errors["signed_cob_form"] = "Please indicate if you signed a COB form"

    # Headshot
    if not headshot:
        errors["headshot"] = "Please upload a headshot photo"

    return errors


from firebase_admin import auth

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    errors = validate_signup(data)
    if errors:
        return jsonify({"errors": errors}), 400

    print("🔥 Incoming form data:")
    for key, value in data.items():
        print(f"{key}: {value}")

    try:
        # 1. Create Firebase Authentication User
        user_record = auth.create_user(
            email=data["email"],
            email_verified=False,
            # password=data.get("password", "DefaultPassword123!"),  # password from frontend
            display_name=f"{data['first_name']} {data['last_name']}"
        )

        # 2. Send Verification Email Link
        link = auth.generate_email_verification_link(data["email"])
        # (Optional) Send this link via your own email service (SendGrid, SMTP, etc.)
        # or show it immediately on the frontend for testing

        print(f"✅ Verification email link generated: {link}")

        # 3. Save their additional data into Firestore
        result = add_user(data)

        return jsonify({"message": "User created. Please verify your email.", "verification_link": link}), 200

    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({"error": str(e)}), 400
    
@app.route("/api/starUser", methods=["POST"])
def star_user():
    data = request.get_json()

    recruiter_email = data.get("recruiter_email")
    user_email = data.get("user_email")
    starred = data.get("starred", False)
    note = data.get("note", "")

    if not recruiter_email or not user_email:
        return jsonify({"error": "Missing recruiter_email or user_email"}), 400

    doc_ref = db.collection("starredUsers").document(recruiter_email)
    doc_ref.set({
        user_email: {
            "starred": starred,
            "note": note
        }
    }, merge=True)

    return jsonify({"success": True}), 200

@app.route("/api/getStarredUsers/<recruiter_email>", methods=["GET"])
def get_starred_users(recruiter_email):
    doc = db.collection("starredUsers").document(recruiter_email).get()

    if not doc.exists:
        return jsonify({})  # no stars yet

    return jsonify(doc.to_dict()), 200



@app.route("/api/starFrat", methods=["POST"])
def star_frat():
    data = request.get_json()

    recruiter_email = data.get("recruiter_email")
    frat_name = data.get("frat_name")
    starred = data.get("starred", False)
    note = data.get("note", "")

    if not recruiter_email or not frat_name:
        return jsonify({"error": "Missing recruiter_email or frat_name"}), 400

    doc_ref = db.collection("starredFrats").document(recruiter_email)
    doc_ref.set({
        frat_name: {
            "starred": starred,
            "note": note
        }
    }, merge=True)

    return jsonify({"success": True}), 200

@app.route("/api/getStarredFrats/<recruiter_email>", methods=["GET"])
def get_starred_frats(recruiter_email):
    doc = db.collection("starredFrats").document(recruiter_email).get()
    if not doc.exists:
        return jsonify({})
    return jsonify(doc.to_dict()), 200








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
