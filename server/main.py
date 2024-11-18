from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import numpy as np
import pickle
import re

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/project"
mongo = PyMongo(app)
CORS(app)

# Load your models
model = pickle.load(open('model.pkl', 'rb'))
sc = pickle.load(open('standscaler.pkl', 'rb'))
mx = pickle.load(open('minmaxscaler.pkl', 'rb'))
classifier = pickle.load(open('classifier.pkl', 'rb'))
ferti = pickle.load(open('fertilizer.pkl', 'rb'))

@app.route('/')
def index():
    return "Welcome to the Crop and Fertilizer Prediction API!"

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    # Debugging print
    print(f"Received data: {data}")

    existing_user = mongo.db.users.find_one({'email': email})
    print(f"Existing User: {existing_user}")

    if existing_user:
        return jsonify({'error': 'User already exists.'}), 400

    hashed_password = generate_password_hash(password)
    user_id = mongo.db.users.insert_one({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': hashed_password
    }).inserted_id

    print(f"User ID: {user_id}")
    return jsonify({'message': 'User registered successfully!', 'user_id': str(user_id)}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        # Return first_name and last_name in response
        return jsonify({
            'message': 'Login successful!',
            'full_name': f"{user['first_name']} {user['last_name']}"
        }), 200

    return jsonify({'error': 'Invalid email or password.'}), 401

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
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            return jsonify({"error": "Invalid email format"}), 400

        # Hash the password if it is updated
        password_hash = generate_password_hash(password) if password else None

        # Build the update dictionary dynamically
        update_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
        }
        if password_hash:
            update_data["password"] = password_hash

        # Update the user document in MongoDB
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or user not found"}), 404

        # Optionally, return the updated user data
        updated_user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if updated_user:
            updated_user['_id'] = str(updated_user['_id'])  # Convert ObjectId to string

        return jsonify({"message": "Profile updated successfully", "user": updated_user}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Predict Crop
@app.route("/predict-crop", methods=['POST'])
def predict_crop():
    data = request.json
    N = data['Nitrogen']
    P = data['Phosphorus']
    K = data['Potassium']
    temp = data['Temperature']
    humidity = data['Humidity']
    ph = data['pH']
    rainfall = data['Rainfall']

    feature_list = [N, P, K, temp, humidity, ph, rainfall]
    single_pred = np.array(feature_list).reshape(1, -1)

    mx_features = mx.transform(single_pred)
    sc_mx_features = sc.transform(mx_features)
    prediction = model.predict(sc_mx_features)

    crop_dict = {
        1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut",
        6: "Papaya", 7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon",
        11: "Grapes", 12: "Mango", 13: "Banana", 14: "Pomegranate",
        15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
        19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
    }

    if prediction[0] in crop_dict:
        crop = crop_dict[prediction[0]]
        result = f"{crop} is the best crop to be cultivated right there."
    else:
        result = "Sorry, we could not determine the best crop to be cultivated with the provided data."
    
    return jsonify({"result": result})

@app.route('/get-profile', methods=['POST'])
def get_profile():
    try:
        data = request.json
        user_id = data.get('user_id')
        
        
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        
        if user:
            # Exclude the password field for security
            user.pop('password', None)
            return jsonify({
                'user_id': str(user['_id']),
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email'],
            }), 200

        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Predict Fertilizer
@app.route("/predict-fertilizer", methods=['POST'])
def predict_fertilizer():
    temp = request.json.get('temp')
    humi = request.json.get('humid')
    mois = request.json.get('mois')
    soil = request.json.get('soil')  
    crop = request.json.get('crop')   
    nitro = request.json.get('nitro')
    pota = request.json.get('pota')
    phosp = request.json.get('phos')

    soil_mapping = {
        "Black": 0,
        "Clayey": 1,
        "Loamy": 2,
        "Red": 3,
        "Sandy": 4
    }

    crop_mapping = {
        "Barley": 0,
        "Cotton": 1,
        "Ground Nuts": 2,
        "Maize": 3,
        "Millets": 4,
        "Oil Seeds": 5,
        "Paddy": 6,
        "Pulses": 7,
        "Sugarcane": 8,
        "Tobacco": 9,
        "Wheat": 10,
        "Rice": 11
    }

    soil_code = soil_mapping.get(soil, -1)  
    crop_code = crop_mapping.get(crop, -1)  

    input_data = [int(temp), int(humi), int(mois), soil_code, crop_code, int(nitro), int(pota), int(phosp)]

    res = ferti.classes_[classifier.predict([input_data])]

    return jsonify({"result": f"Predicted Fertilizer is {res[0]}"})  

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)  # Allow access from other devices
