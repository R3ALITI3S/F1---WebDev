import os # os system

import fastf1 # Import the FastF1 library for Formula 1 data

from flask import Flask, jsonify # Import Flask to create a web server and jsonify to send JSON data

app = Flask(__name__) # Create the Flask web application


# Create a folder called "cache" if it doesn't already exist
# FastF1 uses this folder to store downloaded F1 data
os.makedirs("cache", exist_ok=True)

# Tell FastF1 to use the "cache" folder to save downloaded data
fastf1.Cache.enable_cache("cache")


# Define a route for the URL "/results"
# When someone visits http://127.0.0.1:5000/results this function runs
@app.route("/results")
def results():

    # Get a Formula 1 session
    # Arguments: year, track, session type
    # "R" means Race
    session = fastf1.get_session(2026, "Shanghai", "R")

    # Load the race data (laps, results, drivers, telemetry, etc.)
    session.load()

    # Select only specific columns from the results table
    # Abbreviation = driver code (VER, HAM, etc.)
    # Position = finishing position
    # TeamName = driver's team
    results = session.results[["Abbreviation", "Position", "TeamName"]]

    # Convert the results table into JSON format and return it
    # This allows a website or browser to read the data
    return jsonify(results.to_dict(orient="records"))


# This ensures the server only runs when this file is executed directly
if __name__ == "__main__":

    # Start the Flask web server
    # It will run on http://127.0.0.1:5000
    # debug=True automatically reloads the server when you change code
    app.run(port=5000, debug=True)