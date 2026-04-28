from flask import Flask
from flask_cors import CORS

from Service.Schedule import schedule_bp
from f1Data import data_bp

app = Flask(__name__)

# Enable CORS (React needs this)
CORS(app)

# Register API blueprints
app.register_blueprint(schedule_bp, url_prefix="/Calendar")
app.register_blueprint(data_bp, url_prefix="/data")


# Optional test route (good for checking server works)
@app.route("/")
def home():
    return {"message": "Flask API is running"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)