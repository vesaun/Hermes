import flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)  # Create the Flask app instance
CORS(app)  # Enable CORS


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
    return jsonify({"message": "Sign up successful!"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)