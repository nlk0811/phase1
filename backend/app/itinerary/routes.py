from flask import request, jsonify, current_app, send_file
from app.config import model
from app.itinerary import itinerary_bp
import json
from datetime import datetime
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Existing Itinerary API
@itinerary_bp.route('/generate-itinerary', methods=['POST'])
def generate_itinerary():
    data = request.get_json()
    if not data:
        return "Bad request", 400

    budget = data.get('budget')
    interests = data.get('interests', [])
    duration = data.get('duration')
    source = data.get('source')

    prompt = create_prompt(source, budget, interests, duration)

    try:
        response = call_gemini_api(prompt)
        return jsonify({"itinerary": response})
    except Exception as e:
        return f"Failed to generate itinerary: {str(e)}", 500


# function to create prompt for gemini api to generate itineray with source only in the defined json format
def create_prompt(source, budget, interests, duration):
    return (
        f"Generate a travel itinerary starting from {source} "
        f"with a budget of {budget} rupees, focusing on the following interests: {interests},"
        f"for a duration of {duration} days. Return the response in JSON format only, ensuring it always follows this structure:\n\n"
        "{\n"
        "  \"budget\": {\n"
        "    \"breakdown\": {\n"
        "      \"accommodation\": \"string\",\n"
        "      \"activities\": \"string\",\n"
        "      \"food\": \"string\",\n"
        "      \"miscellaneous\": \"string\",\n"
        "      \"transportation\": \"string\"\n"
        "    },\n"
        "    \"total\": \"string\"\n"
        "  },\n"
        "  \"places\": \"comma-separated list of all places included in the itinerary\",\n"
        "  \"itinerary\": {\n"
        "    \"days\": [\n"
        "      {\n"
        "        \"day\": number,\n"
        "        \"heading\": \"string\",\n"
        "        \"description\": \"string\",\n"
        "        \"activities\": [\n"
        "          {\n"
        "            \"name\": \"string\",\n"
        "            \"type\": \"string\",\n"
        "            \"cost\": \"string\"\n"
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ]\n"
        "  },\n"
        "  \"notes\": \"string\"\n"
        "}"
    )

# fuction returning promt with source and requests
@itinerary_bp.route('/generate-itinerary-with-requests', methods=['POST'])
def generate_itinerary_with_requests():
    data = request.get_json()
    if not data:
        return "Bad request", 400

    budget = data.get('budget')
    interests = data.get('interests', [])
    duration = data.get('duration')
    source = data.get('source')
    requests = data.get('requests') 

    prompt = create_prompt_with_requests(source, budget, interests, duration, requests)

    try:
        response = call_gemini_api(prompt)
        return jsonify({"itinerary": response})
    except Exception as e:
        return f"Failed to generate itinerary: {str(e)}", 500


# function to create prompt for gemini api to generate itineray with source only in the defined json format
def create_prompt_with_requests(source, budget, interests, duration, requests):
    return (
f"Generate a travel itinerary starting from {source} "
f"with a budget of {budget} rupees, focusing on the following interests: {interests}, "
f"but i would like to do this without fail: {requests}. The itinerary should "
f"be planned for a duration of {duration} days. Return the response in JSON format only, "
f"ensuring it always follows this structure:\n\n"
"{\n"
"  \"budget\": {\n"
"    \"breakdown\": {\n"
"      \"accommodation\": \"string\",\n"
"      \"activities\": \"string\",\n"
"      \"food\": \"string\",\n"
"      \"miscellaneous\": \"string\",\n"
"      \"transportation\": \"string\"\n"
"    },\n"
"    \"total\": \"string\"\n"
"  },\n"
"  \"places\": \"comma-separated list of all places included in the itinerary\",\n"
"  \"itinerary\": {\n"
"    \"days\": [\n"
"      {\n"
"        \"day\": number,\n"
"        \"heading\": \"string\",\n"
"        \"description\": \"string\",\n"
"        \"activities\": [\n"
"          {\n"
"            \"name\": \"string\",\n"
"            \"type\": \"string\",\n"
"            \"cost\": \"string\"\n"
"          }\n"
"        ]\n"
"      }\n"
"    ]\n"
"  },\n"
"  \"notes\": \"string\"\n"
"}"

    )

# function to call gemini api
def call_gemini_api(prompt):
    print("Hello0000000000000000000000000000000000000000000000000000000000000000000000000000000")
    response = model.generate_content(prompt)
    response_text = response.text
    # print(response_text)


    if response_text.startswith("```json"):
        response_text = response_text[7:]
    
    response_text = response_text.strip()
    if response_text.endswith("```"):
        response_text = response_text[:-3]
    # print(response_text)
    # print("Hello")
    # print(response_text[:-3])

    try:
        itinerary_json = json.loads(response_text)
    except json.JSONDecodeError as e:
        raise ValueError("Failed to parse JSON response") from e

    return itinerary_json


# New Itinerary API with Source and Destination
@itinerary_bp.route('/generate-itinerary-with-destination', methods=['POST'])
def generate_itinerary_with_destination():
    data = request.get_json()
    if not data:
        return "Bad request", 400

    # Extract user input
    budget = data.get('budget')
    interests = data.get('interests', [])
    duration = data.get('duration')
    source = data.get('source')
    destination = data.get('destination')

    # Create prompt for the Gemini API
    prompt = create_prompt_with_destination(source, destination, budget, interests, duration)

    try:
        # Call the Google Gemini API
        print("Calling")
        response = call_gemini_api(prompt)
        # print("Gemini API Response:", response)
        return jsonify({"itinerary": response})
    except Exception as e:
        return f"Failed to generate itinerary: {str(e)}", 500


# function to create prompt for gemini api to generate itineray with destination in the defined json format
def create_prompt_with_destination(source, destination, budget, interests, duration):
    return (
        f"Generate a travel itinerary starting from {source} to {destination} "
        f"with a budget of {budget} rupees, focusing on the following interests: {interests}, "
        f"for a duration of {duration} days. Return the response in JSON format only, ensuring it always follows this structure:\n\n"
        "{\n"
        "  \"budget\": {\n"
        "    \"breakdown\": {\n"
        "      \"accommodation\": \"string\",\n"
        "      \"activities\": \"string\",\n"
        "      \"food\": \"string\",\n"
        "      \"miscellaneous\": \"string\",\n"
        "      \"transportation\": \"string\"\n"
        "    },\n"
        "    \"total\": \"string\"\n"
        "  },\n"
        "  \"places\": \"comma-separated list of all places included in the itinerary\",\n"  # New field for places
        "  \"itinerary\": {\n"
        "    \"days\": [\n"
        "      {\n"
        "        \"day\": number,\n"
        "        \"heading\": \"string\",\n"
        "        \"description\": \"string\",\n"
        "        \"activities\": [\n"
        "          {\n"
        "            \"name\": \"string\",\n"
        "            \"type\": \"string\",\n"
        "            \"cost\": \"string\"\n"
        "          }\n"
        "        ]\n"
        "      }\n"
        "    ]\n"
        "  },\n"
        "  \"notes\": \"string\"\n"
        "}"
    )

#this is returning the iternery with destination and requests
@itinerary_bp.route('/generate-itinerary-with-destination-and-requests', methods=['POST'])
def generate_itinerary_with_destination_and_requests():
    data = request.get_json()
    if not data:
        return "Bad request", 400

    # Extract user input
    budget = data.get('budget')
    interests = data.get('interests', [])
    duration = data.get('duration')
    source = data.get('source')
    destination = data.get('destination')
    requests = data.get('requests')

    # Create prompt for the Gemini API
    prompt = create_prompt_with_destination_and_requests(source, destination, budget, interests, duration, requests)

    try:
        # Call the Google Gemini API
        print("Calling")
        response = call_gemini_api(prompt)
        # print("Gemini API Response:", response)
        return jsonify({"itinerary": response})
    except Exception as e:
        return f"Failed to generate itinerary: {str(e)}", 500


# function to create prompt for gemini api to generate itineray with destination in the defined json format
def create_prompt_with_destination_and_requests(source, destination, budget, interests, duration, requests):
    return (
f"Generate a travel itinerary starting from {source} to {destination} "
f"with a budget of {budget} rupees, focusing on the following interests: {interests}, "
f"but i would like to do this without fail: {requests}. The itinerary should "
f"be planned for a duration of {duration} days. Return the response in JSON format only, "
f"ensuring it always follows this structure:\n\n"
"{\n"
"  \"budget\": {\n"
"    \"breakdown\": {\n"
"      \"accommodation\": \"string\",\n"
"      \"activities\": \"string\",\n"
"      \"food\": \"string\",\n"
"      \"miscellaneous\": \"string\",\n"
"      \"transportation\": \"string\"\n"
"    },\n"
"    \"total\": \"string\"\n"
"  },\n"
"  \"places\": \"comma-separated list of all places included in the itinerary\",\n"
"  \"itinerary\": {\n"
"    \"days\": [\n"
"      {\n"
"        \"day\": number,\n"
"        \"heading\": \"string\",\n"
"        \"description\": \"string\",\n"
"        \"activities\": [\n"
"          {\n"
"            \"name\": \"string\",\n"
"            \"type\": \"string\",\n"
"            \"cost\": \"string\"\n"
"          }\n"
"        ]\n"
"      }\n"
"    ]\n"
"  },\n"
"  \"notes\": \"string\"\n"
"}"

    )


# Endpoint for Saving user generated itineraries to mongo DB
@itinerary_bp.route('/save-itinerary', methods=['POST'])
def save_itinerary():
    try:
        db = current_app.config['db']
        users_collection = db['users']
        
        # Get the itinerary data from the request
        data = request.get_json()

        if not data or not data.get('user_email'):
            return jsonify({"error": "No data or email provided"}), 400

        user_email = data['user_email']

        # Add a created_at timestamp to the itinerary
        itinerary = {
            "created_at": datetime.now(),
            "itinerary_data": data['itinerary_data']  # Assuming `itinerary_data` contains the itinerary details
        }

        # Find the user by email and update their document by pushing the new itinerary into the itineraries array
        result = users_collection.update_one(
            {"email": user_email},
            {"$push": {"itineraries": itinerary}}
        )

        if result.matched_count > 0:
            return jsonify({"message": "Itinerary saved successfully!"}), 201
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Endpoint for Fetching saved itineraries from mongo DB
@itinerary_bp.route('/fetch-itineraries', methods=['GET'])
def fetch_itineraries():
    try:
        db = current_app.config['db']
        users_collection = db['users']
        
        # Get the user's email from the query parameters
        email = request.args.get('email')

        if not email:
            return jsonify({"error": "Email parameter is required"}), 400

        # Fetch the user document with the matching email
        user = users_collection.find_one({"email": email}, {'_id': 0, 'itineraries': 1})

        if user and 'itineraries' in user:
            return jsonify({"itineraries": user['itineraries']}), 200
        else:
            return jsonify({"message": "No itineraries found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Updated PDF generation endpoint
@itinerary_bp.route('/download-itinerary-pdf', methods=['POST'])
def download_itinerary_pdf():
    try:
        data = request.get_json()
        if not data or 'itinerary' not in data:
            return jsonify({"error": "No itinerary data provided"}), 400

        itinerary = data['itinerary']

        # Create a BytesIO buffer to store the PDF
        buffer = BytesIO()

        # Create the PDF
        c = canvas.Canvas(buffer, pagesize=letter)
        c.setFont("Helvetica", 12)

        # Add content to the PDF
        y = 750  # Starting y position
        c.drawString(100, y, "Travel Itinerary")
        y -= 20

        # Add budget information
        if 'budget' in itinerary:
            y -= 20
            c.drawString(100, y, "Budget Breakdown:")
            for item, cost in itinerary['budget']['breakdown'].items():
                y -= 15
                c.drawString(120, y, f"{item.capitalize()}: {cost}")
            y -= 15
            c.drawString(120, y, f"Total: {itinerary['budget']['total']}")

        # Add places covered
        if 'places' in itinerary:
            y -= 30
            c.drawString(100, y, "Places Covered:")
            y -= 15
            wrapped_places = wrap_text(itinerary['places'], 60)
            for line in wrapped_places:
                c.drawString(120, y, line)
                y -= 15

        # Add daily itinerary
        if 'itinerary' in itinerary and 'days' in itinerary['itinerary']:
            for day in itinerary['itinerary']['days']:
                if y < 100:  # Check if we need a new page
                    c.showPage()
                    c.setFont("Helvetica", 12)
                    y = 750

                y -= 30
                c.drawString(100, y, f"Day {day['day']}: {day['heading']}")
                y -= 15
                wrapped_description = wrap_text(day['description'], 70)
                for line in wrapped_description:
                    c.drawString(120, y, line)
                    y -= 15
                for activity in day['activities']:
                    y -= 15
                    c.drawString(140, y, f"{activity['name']} - {activity['type']} ({activity['cost']})")

        # Add notes if present
        if 'notes' in itinerary:
            if y < 100:  # Check if we need a new page
                c.showPage()
                c.setFont("Helvetica", 12)
                y = 750
            y -= 30
            c.drawString(100, y, "Notes:")
            y -= 15
            wrapped_notes = wrap_text(itinerary['notes'], 70)
            for line in wrapped_notes:
                c.drawString(120, y, line)
                y -= 15

        c.save()
        buffer.seek(0)

        return send_file(buffer, as_attachment=True, download_name="travel_itinerary.pdf", mimetype="application/pdf")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper function to wrap text
def wrap_text(text, max_width):
    words = text.split()
    lines = []
    current_line = []
    current_width = 0

    for word in words:
        if current_width + len(word) <= max_width:
            current_line.append(word)
            current_width += len(word) + 1
        else:
            lines.append(' '.join(current_line))
            current_line = [word]
            current_width = len(word)

    if current_line:
        lines.append(' '.join(current_line))

    return lines

