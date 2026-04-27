from flask import Flask, render_template
from Service.f1Data import data_bp
# from Service.Schedule import schedule_bp # Uncomment if file exists

app = Flask(__name__)

# Registration
app.register_blueprint(data_bp, url_prefix="/data")
# app.register_blueprint(schedule_bp, url_prefix="/schedule")

@app.route("/")
@app.route("/homepage")
def home():
    return render_template("homePage.html")

@app.route("/drivers")
def about():
    return render_template("Drivers.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)