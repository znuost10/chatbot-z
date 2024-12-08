import subprocess
from flask import Flask, request, jsonify

app = Flask(__name__)

def query_modal_chatbot(user_input):
    # Run the modal command as a subprocess.
    # This assumes you have the Modal CLI and are currently in the directory
    # with ollama-modal.py. Adjust the path if needed.
    result = subprocess.run(
        ["modal", "run", "ollama-modal.py", "--text", user_input],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if result.returncode != 0:
        # If there's an error running the modal command, return the error message
        return {"error": result.stderr}

    # result.stdout should contain the model’s response printed by ollama-modal.py
    return {"response": result.stdout}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON request"}), 400

    user_input = data.get("text")
    if not user_input:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    chatbot_response = query_modal_chatbot(user_input)
    return jsonify(chatbot_response)

if __name__ == "__main__":
    # The Flask server will run on http://localhost:5001
    app.run(port=5001, debug=True)
