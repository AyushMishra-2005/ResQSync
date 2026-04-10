import torch
import pickle
import pandas as pd
import numpy as np

from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.metrics import classification_report, accuracy_score

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# Load tokenizer
tokenizer = BertTokenizer.from_pretrained("models/tokenizer")

# Load models
model_cat = BertForSequenceClassification.from_pretrained("models/category_model").to(device)
model_pri = BertForSequenceClassification.from_pretrained("models/priority_model").to(device)

model_cat.eval()
model_pri.eval()

# Load encoders
with open("models/cat_encoder.pkl", "rb") as f:
    cat_encoder = pickle.load(f)

with open("models/pri_encoder.pkl", "rb") as f:
    pri_encoder = pickle.load(f)


# Tokenize function
def tokenize(texts):
    return tokenizer(texts, padding=True, truncation=True, max_length=128, return_tensors="pt")


# Prediction function
def predict(texts):
    inputs = tokenize(texts)

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        cat_outputs = model_cat(**inputs)
        pri_outputs = model_pri(**inputs)

    cat_preds = torch.argmax(cat_outputs.logits, dim=1).cpu().numpy()
    pri_preds = torch.argmax(pri_outputs.logits, dim=1).cpu().numpy()

    cat_labels = cat_encoder.inverse_transform(cat_preds)
    pri_labels = pri_encoder.inverse_transform(pri_preds)

    return cat_labels, pri_labels



test_texts = [
    "Several families displaced by the cyclone are struggling without access to clean drinking water and require immediate assistance",
    "The village school lacks proper infrastructure and is seeking support to improve learning conditions over the coming months",
    "A sudden outbreak of illness has been reported in the camp and medical supplies are urgently needed to prevent further spread",
    "Local farmers are facing reduced income due to irregular rainfall and need financial guidance and livelihood support",
    "There is a growing shortage of sanitation facilities in the area which needs to be addressed soon to maintain hygiene",
    "Communities in remote regions are planning to improve water storage systems before the next dry season",
    "An accident on the highway has left multiple individuals injured and there is an immediate requirement for blood donors",
    "Volunteers are being requested to help organize educational workshops for underprivileged children",
    "Following recent floods several homes have been damaged and shelter materials are needed urgently for rehabilitation",
    "The organization is preparing to distribute food supplies as part of a long term support initiative for vulnerable groups"
]

cat_preds, pri_preds = predict(test_texts)

for i, text in enumerate(test_texts):
    print("\nText:", text)
    print("Predicted Category:", cat_preds[i])
    print("Predicted Priority:", pri_preds[i])


