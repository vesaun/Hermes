import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate('firebase-key.json')  # path to your JSON key
firebase_admin.initialize_app(cred)

# Connect to Firestore
db = firestore.client()

# Reference the users collection
users_ref = db.collection('users')

# Stream all documents in users
docs = users_ref.stream()

# Loop through and delete
for doc in docs:
    print(f"Deleting user: {doc.id}")
    doc.reference.delete()

print("✅ Finished deleting users.")
