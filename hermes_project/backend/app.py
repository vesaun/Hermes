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
import re

app = Flask(__name__)
CORS(app)

#VESAUN's PATH
#/Users/vesaunshrestha/Documents/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json

#LOGAN's PATH
#/Users/logan/OneDrive/Desktop/hackcu/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json
cred = credentials.Certificate("/Users/vesaunshrestha/Documents/Hermes/hermes_project/hackcu-452419-firebase-adminsdk-fbsvc-93c42f86ce.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

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
            "instagram_username": frat_dict.get("instagram_username")
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
            "major": user_dict.get("major")
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

if __name__ == '__main__':
    app.run(debug=True, port=8080)