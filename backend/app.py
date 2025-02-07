from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import pytz
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

DESK_DATA_FILE = "desks.json"

# Set timezone (Change this to your local timezone)
TIMEZONE = pytz.timezone("Asia/Kolkata")  # IST (Indian Standard Time)

# Load desk data
def load_data():
    if not os.path.exists(DESK_DATA_FILE):
        return {"desks": {}}
    with open(DESK_DATA_FILE, "r") as f:
        return json.load(f)

# Save desk data
def save_data(data):
    with open(DESK_DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

# Auto-reset desks at 6 PM IST daily
def reset_desks():
    current_time = datetime.now(TIMEZONE).strftime("%Y-%m-%d %H:%M:%S")
    print(f"Resetting all desks at {current_time} (IST)")

    data = load_data()
    for desk in data["desks"]:
        data["desks"][desk]["status"] = "available"
        data["desks"][desk]["user"] = ""

    save_data(data)
    print("All desks have been reset.")

# Scheduler for auto-reset
scheduler = BackgroundScheduler()
scheduler.add_job(reset_desks, "cron", hour=18, minute=0)
scheduler.start()

@app.route("/desks", methods=["GET"])
def get_desks():
    return jsonify(load_data())

@app.route("/desk/<desk_id>", methods=["POST"])
def update_desk(desk_id):
    data = load_data()
    action = request.json.get("action")
    user_name = request.json.get("user", "").strip()

    if desk_id in data["desks"]:
        if action == "occupy" and user_name:
            data["desks"][desk_id]["status"] = "occupied"
            data["desks"][desk_id]["user"] = user_name
        elif action == "leave":
            data["desks"][desk_id]["status"] = "available"
            data["desks"][desk_id]["user"] = ""
        save_data(data)
        return jsonify({"status": "success"})
    
    return jsonify({"error": "Desk not found"}), 404

@app.route("/search/<string:user_name>", methods=["GET"])
def search_user(user_name):
    user_name = user_name.strip().lower()  # Normalize input
    data = load_data()
    
    for desk_id, details in data["desks"].items():
        if details["user"].strip().lower().startswith(user_name):  # Partial match
            return jsonify({"desk_id": desk_id, "status": details["status"]})

    return jsonify({"error": "User not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
