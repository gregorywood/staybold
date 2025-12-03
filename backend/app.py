from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data.json')

# Initialize data file if it doesn't exist
def init_data_file():
    if not os.path.exists(DATA_FILE) or os.path.getsize(DATA_FILE) == 0:
        with open(DATA_FILE, 'w') as f:
            json.dump({}, f)

# Read data from JSON file
def read_data():
    init_data_file()
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

# Write data to JSON file
def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Get all habit data
@app.route('/api/habits', methods=['GET'])
def get_habits():
    data = read_data()
    return jsonify(data)

# Get habit data for a specific month
@app.route('/api/habits/<year>/<month>', methods=['GET'])
def get_habits_by_month(year, month):
    data = read_data()
    # Filter data for the requested month
    month_data = {}
    prefix = f"{year}-{month.zfill(2)}"
    for date_str, habit_data in data.items():
        if date_str.startswith(prefix):
            month_data[date_str] = habit_data
    return jsonify(month_data)

# Save or update habit data for a specific date
@app.route('/api/habits', methods=['POST'])
def save_habit():
    habit_entry = request.json
    date = habit_entry.get('date')

    if not date:
        return jsonify({'error': 'Date is required'}), 400

    # Validate date format (YYYY-MM-DD)
    try:
        datetime.strptime(date, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    data = read_data()

    # Store the habit data
    data[date] = {
        'alcohol': habit_entry.get('alcohol', 0),
        'exercise': habit_entry.get('exercise', False),
        'drugs': habit_entry.get('drugs', False),
        'notes': habit_entry.get('notes', '')
    }

    write_data(data)
    return jsonify({'success': True, 'data': data[date]})

# Delete habit data for a specific date
@app.route('/api/habits/<date>', methods=['DELETE'])
def delete_habit(date):
    data = read_data()

    if date in data:
        del data[date]
        write_data(data)
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Date not found'}), 404

if __name__ == '__main__':
    init_data_file()
    app.run(debug=True, port=5000)

# Initialize data file on startup (for production)
init_data_file()
