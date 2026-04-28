import os
import sqlite3
import fastf1
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables the connection to React

# --- DATABASE SETUP ---
DB_PATH = 'f1_custom.db'


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS custom_results
                   (
                       id
                       INTEGER
                       PRIMARY
                       KEY
                       AUTOINCREMENT,
                       season
                       INTEGER,
                       race
                       TEXT,
                       name
                       TEXT,
                       team
                       TEXT,
                       lap_time_seconds
                       REAL
                   )
                   ''')
    conn.commit()
    conn.close()


init_db()


# --- HELPER ---
def format_to_f1_standard(seconds):
    if seconds == float('inf') or seconds is None: return ""
    minutes = int(seconds // 60)
    secs = seconds % 60
    return f"{minutes}:{secs:06.3f}"


# --- ROUTES ---
@app.route("/api/results")
def get_results():
    season = request.args.get("season", default=2026, type=int)
    race = request.args.get("race", type=str)

    # 1. Fetch FastF1 Data (Simplified for this example)
    # In a real scenario, use your existing FastF1 logic here
    official_drivers = [
        {"Position": 1, "Abbreviation": "VER", "TeamName": "Red Bull", "Time": "1:30.123", "Gap": "WINNER",
         "isUser": False},
        {"Position": 2, "Abbreviation": "HAM", "TeamName": "Mercedes", "Time": "1:30.500", "Gap": "+0.377s",
         "isUser": False}
    ]

    # 2. Fetch User Data from SQLite
    user_entries = []
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, team, lap_time_seconds FROM custom_results WHERE season=? AND race=?",
                   (season, race))
    for row in cursor.fetchall():
        user_entries.append({
            "id": row[0],
            "Position": "??",  # Logic to calculate position would go here
            "Abbreviation": f"{row[1]} (YOU)",
            "TeamName": row[2],
            "Time": format_to_f1_standard(row[3]),
            "Gap": "+0.000s",
            "isUser": True
        })
    conn.close()

    return jsonify({"finish_order": official_drivers + user_entries})


@app.route("/api/add_entry", methods=["POST"])
def add_entry():
    data = request.json
    # Convert '1:32.450' to seconds
    time_parts = data['time'].split(':')
    seconds = float(time_parts[0]) * 60 + float(time_parts[1])

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO custom_results (season, race, name, team, lap_time_seconds) VALUES (?, ?, ?, ?, ?)",
                   (data['season'], data['race'], data['name'], data['team'], seconds))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)