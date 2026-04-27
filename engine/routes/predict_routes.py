from flask import Blueprint, request, jsonify
from services.prediction_service import get_prediction

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    result = get_prediction(data["text"])

    return jsonify(result)