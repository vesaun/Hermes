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
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from firebase_admin import auth as firebase_auth
from google.oauth2 import service_account
from googleapiclient.discovery import build
import datetime
from sendgrid.helpers.mail import Mail, Email, To, Content, Personalization
from sendgrid import SendGridAPIClient
from pathlib import Path

# import pymysql

# Configure your database connection details via environment variables or hard-code (not recommended for production)
# DB_HOST = os.environ.get("DB_HOST", "localhost")
# DB_USER = os.environ.get("DB_USER", "your_db_username")
# DB_PASS = os.environ.get("DB_PASS", "your_db_password")
# DB_NAME = os.environ.get("DB_NAME", "users_db")


# load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env.local")
load_dotenv(dotenv_path=".env.local")  # Load environment variables from .env file
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

@app.route("/api/getCalendarEvents", methods=["GET"])
def get_calendar_events():
    docs = db.collection("calendar_events").stream()
    events = [doc.to_dict() | {"id": doc.id} for doc in docs]
    return jsonify({"events": events})

@app.route("/api/addEvent", methods=["POST"])
def add_event():
    data = request.get_json()
    doc_ref = db.collection("calendar_events").add(data)
    # return jsonify({"success": True}), 200
    return jsonify({"success": True, "id": doc_ref[1].id}), 200

@app.route("/api/updateEvent/<event_id>", methods=["PUT"])
def update_event(event_id):
    data = request.get_json()
    db.collection("calendar_events").document(event_id).update(data)
    return jsonify({"success": True}), 200

@app.route("/api/deleteEvent/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    db.collection("calendar_events").document(event_id).delete()
    return jsonify({"success": True}), 200

@app.route("/api/starEvent", methods=["POST"])
def star_event():
    data = request.get_json()
    user_email = data.get("user_email")
    event_id = data.get("event_id")
    starred = data.get("starred", False)

    if not user_email or not event_id:
        return jsonify({"error": "Missing user_email or event_id"}), 400

    doc_ref = db.collection("starredEvents").document(user_email)
    doc_ref.set({event_id: {"starred": starred}}, merge=True)
    return jsonify({"success": True}), 200

@app.route("/api/getStarredEvents/<user_email>", methods=["GET"])
def get_starred_events(user_email):
    doc = db.collection("starredEvents").document(user_email).get()
    if not doc.exists:
        return jsonify({})
    return jsonify(doc.to_dict()), 200



# @app.route("/api/findUserData/<email>", methods=["GET"])
# def findUserData(email):
#     users_ref = db.collection("users")
#     query = users_ref.where("email", "==", email).stream()
#     user_data_list = [to_clean_dict(clean_user_data(user.to_dict())) for user in query]
#     if not user_data_list:
#         return jsonify({"error": "User not found"}), 404
#     return jsonify(user_data_list)

@app.route("/api/findUserData/<email>", methods=["GET"])
def findUserData(email):
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).stream()
    
    user_data_list = []
    for doc in query:
        user = doc.to_dict()  # ✅ Convert Firestore document to dictionary

        user_data_list.append({
            "email": user.get("email"),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "admin": bool(user.get("admin", False)),  # ✅ Ensure it's a boolean
            "fraternity": user.get("fraternity", ""),
            "is_active": user.get("is_active", False),
            "major": user.get("major", ""),
            "gpa": user.get("gpa", ""),
            "hometown_state": user.get("hometown_state", ""),
            "hometown_city": user.get("hometown_city", ""),
            "phone_number": user.get("phone_number", ""),
            "instagram_handle": user.get("instagram_handle", ""),
            "highschool": user.get("highschool", ""),
            "hometown_country": user.get("hometown_country", ""),
            "rush_interest": user.get("rush_interest", ""),
            "hs_activities": user.get("hs_activities", ""),
            "hs_accomplishments": user.get("hs_accomplishments", ""),
            "headshot": user.get("headshot", ""),
            "ifc_admin": bool(user.get("ifc_admin", False))
        })

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
    user_data = []

    for user in users_ref:
        u = user.to_dict()  # ✅ Convert Firestore document to dictionary

        user_data.append({
            "email": u.get("email"),
            "first_name": u.get("first_name"),
            "last_name": u.get("last_name"),
            "phone_number": u.get("phone_number"),
            "birthday": u.get("birthday"),
            "hometown_address": u.get("hometown_address"),
            "hometown_city": u.get("hometown_city"),
            "hometown_state": u.get("hometown_state"),
            "hometown_zip": u.get("hometown_zip"),
            "hometown_country": u.get("hometown_country"),
            "instagram_handle": u.get("instagram_handle"),
            "highschool": u.get("highschool"),
            "grad_year": u.get("grad_year"),
            "gpa": u.get("gpa"),
            "major": u.get("major"),
            "fraternity": u.get("fraternity"),
            "signed_cob_form": u.get("signed_cob_form"),
            "hs_activities": u.get("hs_activities"),
            "hs_accomplishments": u.get("hs_accomplishments"),
            "rush_interest": u.get("rush_interest"),
            "headshot": u.get("headshot"),
            "admin": u.get("admin", False),
            "emergency_contact_number": u.get("emergency_contact_number"),
            "ifc_admin": u.get("ifc_admin", False)
        })

    return jsonify(user_data)


@app.route("/api/updateUserData", methods=["POST"])
def update_user_data():
    data = request.get_json()
    email = data.get("email")
    updates = data.get("updates", {})

    if not email:
        return jsonify({"error": "Missing email"}), 400

    user_doc = db.collection("users").where("email", "==", email).stream()
    user_id = None
    for doc in user_doc:
        user_id = doc.id
        break

    if not user_id:
        return jsonify({"error": "User not found"}), 404

    db.collection("users").document(user_id).update(updates)
    updated_doc = db.collection("users").document(user_id).get()
    return jsonify(updated_doc.to_dict()), 200


load_dotenv(dotenv_path=".env.local")  # Load environment variables from .env file
def send_verification_email(recipient_email, verification_link):
    sender_email = os.environ.get("GMAIL_EMAIL")
    sender_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not sender_email or not sender_password:
        print("❌ Missing email credentials in environment variables.")
        return False

    print(f"Preparing to send email to {recipient_email} from {sender_email}...")

    message = MIMEMultipart("alternative")
    message["Subject"] = "Verify your Hermes account"
    message["From"] = sender_email
    message["To"] = recipient_email

    html = f"""<html><body><p>Hi there!</p><p>Thanks for signing up for Hermes.</p>
               <p>Please verify your email by clicking below:</p>
               <p><a href="{verification_link}">Verify Email</a></p></body></html>"""
    message.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, message.as_string())
        print(f"✅ Email sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"❌ Email send failed: {e}")
        return False



from firebase_admin import auth
    
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

from sendgrid.helpers.mail import Mail, Email, To, Content, Personalization
from sendgrid import SendGridAPIClient


@app.route("/api/sendMassEmail", methods=["POST"])
def send_mass_email():
    data = request.get_json()
    message_content = data.get("message", "")
    if not message_content:
        return jsonify({"error": "No message provided"}), 400

    try:
        sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))

        from_email = os.environ.get("SENDGRID_SENDER_EMAIL")
        to_email = "loganhaase3@gmail.com"  # Send only to this address

        mail = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject="Message from IFC Admins",
            html_content=f"<p>{message_content}</p>"
        )

        sg.send(mail)
        return jsonify({"success": True}), 200

    except Exception as e:  
        print("SendGrid error:", e)
        return jsonify({"error": "Failed to send email"}), 500




    
@app.route('/api/hideUser', methods=['POST'])
def hide_user():
    data = request.get_json()
    recruiter_email = data.get("recruiter_email")
    user_email = data.get("user_email")

    if not recruiter_email or not user_email:
        return jsonify({"error": "Missing recruiter_email or user_email"}), 400

    try:
        # Store under a subcollection per recruiter
        hidden_ref = db.collection("hidden_users").document(recruiter_email)
        hidden_ref.set({user_email: True}, merge=True)
        return jsonify({"message": "User hidden successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/getHiddenUsers/<recruiter_email>', methods=['GET'])
def get_hidden_users(recruiter_email):
    try:
        doc = db.collection("hidden_users").document(recruiter_email).get()
        if doc.exists:
            data = doc.to_dict()
            return jsonify(list(data.keys())), 200
        else:
            return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/unhideUser", methods=["POST"])
def unhide_user():
    data = request.get_json()
    recruiter_email = data.get("recruiter_email")
    user_email = data.get("user_email")

    doc_ref = db.collection("hidden_users").document(recruiter_email)
    doc_ref.update({user_email: firestore.DELETE_FIELD})
    return jsonify({"status": "success", "message": "User unhidden."})


@app.route("/api/prebidUser", methods=["POST"])
def prebid_user():
    data = request.get_json()
    email = data.get("user_email")
    fraternity_id = data.get("fraternity_id")

    if not email or not fraternity_id:
        return jsonify({"error": "Missing fields"}), 400

    try:
        # Find the user document
        user_query = db.collection("users").where("email", "==", email).limit(1).get()
        if not user_query:
            return jsonify({"error": "User not found"}), 404

        user_doc = user_query[0]
        user_data = user_doc.to_dict()
        user_id = user_doc.id

        # Add to fraternity's members collection
        db.collection("fraternities").document(fraternity_id).collection("members").document(user_id).set(user_data)

        # Add to global prebids collection
        db.collection("prebids").document(user_id).set({
            **user_data,
            "fraternity": fraternity_id
        })

        # Remove from users collection
        db.collection("users").document(user_id).delete()

        return jsonify({"success": True}), 200

    except Exception as e:
        print("Pre-Bid error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/getPreBids", methods=["GET"])
def get_prebids():
    try:
        frats_ref = db.collection("fraternities").stream()
        prebids = []

        for frat_doc in frats_ref:
            frat_id = frat_doc.id
            members_ref = db.collection("fraternities").document(frat_id).collection("members").stream()

            for member in members_ref:
                member_data = member.to_dict()
                name = f"{member_data.get('first_name', '')} {member_data.get('last_name', '')}".strip()
                email = member_data.get("email")
                if email:
                    prebids.append({
                        "name": name or "N/A",
                        "email": email,
                        "fraternity": frat_id
                    })

        return jsonify(prebids), 200

    except Exception as e:
        print("Error fetching pre-bids:", e)
        return jsonify({"error": "Could not fetch pre-bids"}), 500















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


