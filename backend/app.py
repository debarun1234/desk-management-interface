from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import pytz
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Set timezone (India Standard Time - IST)
TIMEZONE = pytz.timezone("Asia/Kolkata")

DATA_FOLDER = "data"

# Lock to handle file write operations safely
file_lock = threading.Lock()

# Function to get JSON path for a floor
def get_floor_json(floor):
    return os.path.join(DATA_FOLDER, f"{floor}.json")

# Load data for a floor
def load_data(floor):
    json_path = get_floor_json(floor)
    if not os.path.exists(json_path):
        return {"error": f"Floor {floor} not found"}, 404  # Return error instead of an empty object
    
    with open(json_path, "r") as f:
        return json.load(f)

# Save data for a floor safely with file lock
def save_data(floor, data):
    json_path = get_floor_json(floor)
    with file_lock:  # Prevent race conditions when writing
        with open(json_path, "w") as f:
            json.dump(data, f, indent=4)

# Auto-reset all floors at 6 PM IST
def reset_all_floors():
    for floor in range(1, 19):  # Floors L1 to L18
        floor_name = f"L{floor}"
        json_path = get_floor_json(floor_name)
        
        if os.path.exists(json_path):
            data = load_data(floor_name)
            for desk in data["desks"]:
                data["desks"][desk]["status"] = "available"
                data["desks"][desk]["user"] = ""
            save_data(floor_name, data)
    
    print(f"All floors reset at {datetime.now(TIMEZONE).strftime('%Y-%m-%d %H:%M:%S')} IST")

# Scheduler for auto-reset
scheduler = BackgroundScheduler(timezone=TIMEZONE)
scheduler.add_job(reset_all_floors, "cron", hour=18, minute=0)  # Reset at 6 PM IST
scheduler.start()

# Get desks for a specific floor
@app.route("/desks/<floor>", methods=["GET"])
def get_desks(floor):
    result = load_data(floor)
    if "error" in result:
        return jsonify(result), 404  # Return proper 404 error if floor is missing
    return jsonify(result)

# Update desk status (occupy or leave)
@app.route("/desk/<floor>/<desk_id>", methods=["POST"])
def update_desk(floor, desk_id):
    result = load_data(floor)
    if "error" in result:
        return jsonify(result), 404  # Return error if floor is missing

    data = result
    action = request.json.get("action")
    user_name = request.json.get("user", "").strip()

    if desk_id in data["desks"]:
        if action == "occupy" and user_name:
            data["desks"][desk_id]["status"] = "occupied"
            data["desks"][desk_id]["user"] = user_name
        elif action == "leave":
            data["desks"][desk_id]["status"] = "available"
            data["desks"][desk_id]["user"] = ""
        save_data(floor, data)
        return jsonify({"status": "success"})
    
    return jsonify({"error": "Desk not found"}), 404

# Search for a user in a floor
@app.route("/search/<string:floor>/<string:user_name>", methods=["GET"])
def search_user(floor, user_name):
    result = load_data(floor)
    if "error" in result:
        return jsonify(result), 404  # Return error if floor is missing

    data = result
    user_name = user_name.strip().lower()  # Normalize input for case-insensitive search
    
    for desk_id, details in data["desks"].items():
        if details["user"].strip().lower().startswith(user_name):  # Matches first few letters
            return jsonify({
                "desk_id": desk_id,
                "status": details["status"],
                "floor": floor  # Include floor info in response
            })

    return jsonify({"error": "User not found on this floor"}), 404

if __name__ == "__main__":
    app.run(debug=True)
