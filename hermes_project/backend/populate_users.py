import firebase_admin
from firebase_admin import credentials, firestore
import random
import faker

# Initialize Firebase
cred = credentials.Certificate('firebase-key.json')  # Make sure this points to your key
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize faker
fake = faker.Faker()

# Sample data pools
majors = ["Computer Science", "Business", "Biology", "Psychology", "Mechanical Engineering", "Finance", "Marketing", "Political Science", "Physics", "Mathematics"]
highschools = ["Edison High School", "Huntington Beach High School", "Corona Del Mar High School", "Newport Harbor High School"]
activities = [
    "Played basketball and baseball", 
    "President of the debate team", 
    "Vice president of math club",
    "Captain of football team", 
    "Chess team member",
    "Swim team captain",
    "Theater lead actor",
    "Volunteer club president"
]
accomplishments = [
    "Honors List", 
    "National Merit Scholar", 
    "AP Scholar with Distinction", 
    "First Place in Math Olympiad",
    "Varsity MVP Basketball", 
    "Science Fair Winner"
]

def generate_fake_user():
    first_name = fake.first_name()
    last_name = fake.last_name()
    full_instagram = f"{first_name.lower()}_{last_name.lower()}{random.randint(1,99)}"
    phone = fake.msisdn()[:10]  # Ensure 10 digit number
    email = f"{first_name.lower()}.{last_name.lower()}@example.com"
    gpa = round(random.uniform(2.5, 4.6), 2)
    highschool = random.choice(highschools)
    hometown_city = fake.city()
    hometown_state = fake.state()
    hometown_country = "United States"
    hometown_address = fake.street_address()
    grad_year = random.choice(["2021", "2022", "2023", "2024"])
    headshot = "https://via.placeholder.com/150"  # Dummy placeholder image

    return {
        "email": email,
        "firstname": first_name,
        "lastname": last_name,
        "phone_number": phone,
        "birthday": str(fake.date_of_birth(minimum_age=17, maximum_age=20)),
        "hometown_address": hometown_address,
        "hometown_city": hometown_city,
        "hometown_state": hometown_state,
        "hometown_zip": fake.zipcode(),
        "hometown_country": hometown_country,
        "instagram_username": full_instagram,
        "highschool": highschool,
        "grad_year": grad_year,
        "gpa": str(gpa),
        "major": random.choice(majors),
        "is_active": True,
        "fraternity": "",
        "signed_cob_form": random.choice(["Yes", "No"]),
        "hs_activities": random.choice(activities),
        "hs_accomplishments": random.choice(accomplishments),
        "rush_interest": fake.sentence(nb_words=10),
        "headshot": headshot
    }

# Generate and upload 50 users
for _ in range(50):
    user_data = generate_fake_user()
    db.collection("users").add(user_data)
    print(f"✅ Uploaded {user_data['firstname']} {user_data['lastname']}")

print("🎉 Done populating 50 users!")
