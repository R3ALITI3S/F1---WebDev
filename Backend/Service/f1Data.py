import os
import fastf1
import sqlite3
import pandas as pd
from flask import Blueprint, jsonify, render_template, request

data_bp = Blueprint("data", __name__)

os.makedirs("../../cache", exist_ok=True)
fastf1.Cache.enable_cache("../../cache")


def init_db():
    conn = sqlite3.connect('../../f1_custom.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS custom_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            season INTEGER,
            race TEXT,
            name TEXT,
            team TEXT,
            lap_time_seconds REAL,
            total_race_time TEXT
        )
    ''')
    conn.commit()
    conn.close()


init_db()


def format_to_f1_standard(seconds):
    if seconds == float('inf') or seconds is None:
        return ""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:06.3f}"
    else:
        return f"{minutes}:{secs:06.3f}"


@data_bp.route("/")
@data_bp.route("/DataPage.html")
def datapage():
    return render_template("DataPage.html")


@data_bp.route("/add_entry", methods=["POST"])
def add_entry():
    data = request.json
    try:
        raw_time = data['time'].replace(',', '.')


        parts = raw_time.split(':')

        if len(parts) == 3:
            hours = float(parts[0])
            minutes = float(parts[1])
            seconds = float(parts[2])

            total_seconds = hours * 3600 + minutes * 60 + seconds


        elif len(parts) == 2:
            minutes = float(parts[0])
            seconds = float(parts[1])

            total_seconds = minutes * 60 + seconds


        else:
            total_seconds = float(parts[0])

        conn = sqlite3.connect('../../f1_custom.db')
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO custom_results (season, race, name, team, lap_time_seconds, total_race_time)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (data['season'], data['race'], data['name'], data['team'], total_seconds, data['time']))
        conn.commit()
        conn.close()

        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@data_bp.route("/delete_entry", methods=["POST"])
def delete_entry():
    entry_id = request.json.get('id')
    conn = sqlite3.connect('../../f1_custom.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM custom_results WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "deleted"})


@data_bp.route("/results")
def results():
    season = request.args.get("season", default=2026, type=int)
    race = request.args.get("race", type=str)

    if not race:
        return jsonify({"error": "Missing 'race' parameter"}), 400

    official_drivers = []
    user_entries = []
    combined_fastest = []

    try:
        session = fastf1.get_session(season, race, "R")
        session.load(laps=True, telemetry=False, weather=False)

        if session.results is None or session.results.empty:
            return jsonify({"error": "No session results found"}), 404

        winner_row = session.results.loc[session.results['Position'] == 1].iloc[0]
        winner_total_seconds = winner_row['Time'].total_seconds()
        total_laps_race = winner_row['Laps']

        for _, row in session.results.iterrows():
            status = str(row['Status'])
            laps_completed = row['Laps']
            lap_diff = int(total_laps_race - laps_completed)

            if pd.isnull(row['Time']) or lap_diff > 0:
                total_sec = float('inf')
                if "Lap" in status or status == "Finished":
                    status = f"+{lap_diff} {'Lap' if lap_diff == 1 else 'Laps'}"
            else:
                total_sec = winner_total_seconds if row['Position'] == 1 else winner_total_seconds + row['Time'].total_seconds()

            official_drivers.append({
                "id": None,
                "isUser": False,
                "SortKey": total_sec,
                "Abbreviation": row['Abbreviation'],
                "TeamName": row['TeamName'],
                "Status": status
            })

        laps = session.laps.dropna(subset=["LapTime"])
        last_laps = laps.groupby("Driver").tail(1)

        for row in last_laps.itertuples():
            team_search = session.results.loc[
                session.results["Abbreviation"] == row.Driver,
                "TeamName"
            ]
            team = team_search.values[0] if not team_search.empty else "Unknown"

            combined_fastest.append({
                "id": None,
                "Abbreviation": row.Driver,
                "TeamName": team,
                "Seconds": row.LapTime.total_seconds()
            })

    except Exception as e:
        return jsonify({"error": f"F1 Error: {str(e)}"}), 500

    try:
        conn = sqlite3.connect('../../f1_custom.db')
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, team, lap_time_seconds
            FROM custom_results
            WHERE season=? AND race LIKE ?
        """, (season, f"%{race}%"))

        for row in cursor.fetchall():
            user_entries.append({
                "id": row[0],
                "isUser": True,
                "SortKey": row[3],
                "Abbreviation": f"{row[1]} (YOU)",
                "TeamName": row[2],
                "Status": "Finished"
            })

            combined_fastest.append({
                "id": row[0],
                "Abbreviation": f"{row[1]} (YOU)",
                "TeamName": row[2],
                "Seconds": row[3]
            })

        conn.close()

    except Exception as e:
        return jsonify({"error": f"DB Error: {str(e)}"}), 500


   
    combined = official_drivers + user_entries

    final_combined = sorted(
        combined,
        key=lambda x: (x['SortKey'] == float('inf'), x['SortKey'])
    )

    final_finish_order = []
    for i, d in enumerate(final_combined):
        if d['SortKey'] == float('inf'):
            display_time = ""
            gap_str = d.get('Status', "DNF")
        else:
            display_time = format_to_f1_standard(d['SortKey'])

            if i == 0:
                gap_str = "WINNER"
            else:
                prev = final_combined[i - 1]
                if prev['SortKey'] != float('inf'):
                    diff = d['SortKey'] - prev['SortKey']
                    gap_str = f"+{diff:.3f}s"
                else:
                    gap_str = "—"

        final_finish_order.append({
            "id": d.get('id'),
            "Position": i + 1,
            "isUser": d.get('isUser', False),
            "Abbreviation": d['Abbreviation'],
            "TeamName": d['TeamName'],
            "Time": display_time,
            "Gap": gap_str
        })


    combined_fastest.sort(key=lambda x: x['Seconds'])
    best_lap = combined_fastest[0]['Seconds'] if combined_fastest else 0

    final_fastest = []
    for i, d in enumerate(combined_fastest, 1):
        gap = d['Seconds'] - best_lap
        final_fastest.append({
            "id": d.get('id'),
            "Position": i,
            "Abbreviation": d['Abbreviation'],
            "TeamName": d['TeamName'],
            "LapTime": format_to_f1_standard(d['Seconds']),
            "Gap": "FASTEST" if gap < 0.001 else f"+{gap:.3f}"
        })

    return jsonify({
        "finish_order": final_finish_order,
        "fastest_laps": final_fastest
    })