from core.inference import predict_model

def get_prediction(text):
    result = predict_model(text)

    if any(word in text.lower() for word in ["urgent", "immediate", "critical", "emergency"]):
        result["priority"] = "HIGH"

    return result