from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/project"
mongo = PyMongo(app)
users_collection = mongo.db.users  # Users collection in MongoDB

# Function to validate email format
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email)

# Update Profile Endpoint
@app.route('/update-profile', methods=['PUT'])
def update_profile():
    try:
        data = request.json
        user_id = data.get('user_id')  # The user's ID sent from the frontend
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        # Ensure the fields are not empty
        if not (first_name and last_name and email):
            return jsonify({"error": "Fields cannot be empty"}), 400

        # Validate email format
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Hash the password if it is updated
        if password:
            password_hash = generate_password_hash(password)
        else:
            password_hash = None

        # Build the update dictionary dynamically
        update_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
        }
        if password_hash:
            update_data["password"] = password_hash

        # Update the user document in MongoDB
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or user not found"}), 404

        # Optionally, return the updated user data
        updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
        return jsonify({"message": "Profile updated successfully", "user": updated_user}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
