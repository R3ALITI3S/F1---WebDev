from flask import Blueprint, jsonify
import fastf1
import datetime

schedule_bp = Blueprint("schedule", __name__)

COUNTRY_CODES = {
    "Azerbaijan": "az",
    "Bahrain": "bh",
    "Saudi Arabia": "sa",
    "Australia": "au",
    "Japan": "jp",
    "Canada": "ca",
    "China": "cn",
    "United States": "us",
    "United Kingdom": "gb",
    "Italy": "it",
    "Monaco": "mc",
    "Spain": "es",
    "Austria": "at",
    "Hungary": "hu",
    "Belgium": "be",
    "Netherlands": "nl",
    "Singapore": "sg",
    "Mexico": "mx",
    "Brazil": "br",
    "Qatar": "qa",
    "Abu Dhabi": "ae"
}


# INTERNAL FUNCTION (no route)
def fetch_schedule(year=None):
    if year is None:
        year = datetime.datetime.now().year

    schedule_df = fastf1.get_event_schedule(year)

    schedule = []
    for _, row in schedule_df[schedule_df["RoundNumber"] > 0].iterrows():
        schedule.append({
            "round": int(row["RoundNumber"]),
            "name": row["EventName"],
            "country": row["Country"],
            "country_code": COUNTRY_CODES.get(row["Country"], "un"),
            "location": row["Location"],
            "date": row["EventDate"].strftime("%d %b %Y")
        })

    return schedule



# API ENDPOINT (React uses this)
@schedule_bp.route("/")
def schedule_api():
    return jsonify(fetch_schedule())