import os
import fastf1
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

os.makedirs("cache", exist_ok=True)
fastf1.Cache.enable_cache("cache")
fastf1.set_log_level("INFO")

# The apps route, and the render_template is how it should be formated and set up
@app.route("/")
def home():
    return render_template("index.html")


# this is where the results are getting put in from the html and getting jsonified
@app.route("/results")
def results():

    season = request.args.get("season", default=2024, type=int)
    race = request.args.get("race", default="Spain", type=str)

    try:
        session = fastf1.get_session(season, race, "R")
        session.load()

        data = session.results[["Abbreviation", "Position", "TeamName"]]

        return jsonify(data.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)})


# DJ RUN IT!
if __name__ == "__main__":
    app.run(port=5000, debug=True, use_reloader=False)