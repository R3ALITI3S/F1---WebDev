import fastf1
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# Enable cache (important for speed + avoiding issues)
# fastf1.Cache.enable_cache("cache")

def get_schedule(year=2026):
    schedule = fastf1.get_event_schedule(year)

    events = []
    for _, event in schedule.iterrows():
        events.append({
            "name": event['EventName'],
            "country": event['Country'],
            "date": str(event['EventDate'].date())
        })

    return events

# Serve your HTML
@app.route("/")
def home():
    return render_template("Schedule.html")

# API endpoint
@app.route("/api/schedule")
def schedule():
    return jsonify(get_schedule())

if __name__ == "__main__":
    app.run(port=5000, debug=True, use_reloader=False)