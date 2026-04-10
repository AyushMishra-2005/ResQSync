import torch
import pickle
from transformers import BertTokenizer, BertForSequenceClassification

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = BertTokenizer.from_pretrained("models/tokenizer")

model_cat = BertForSequenceClassification.from_pretrained("models/category_model").to(device)
model_pri = BertForSequenceClassification.from_pretrained("models/priority_model").to(device)

model_cat.eval()
model_pri.eval()

with open("models/cat_encoder.pkl", "rb") as f:
    cat_encoder = pickle.load(f)

with open("models/pri_encoder.pkl", "rb") as f:
    pri_encoder = pickle.load(f)


def predict_model(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        cat_outputs = model_cat(**inputs)
        pri_outputs = model_pri(**inputs)

    cat_pred = torch.argmax(cat_outputs.logits, dim=1).cpu().numpy()
    pri_pred = torch.argmax(pri_outputs.logits, dim=1).cpu().numpy()

    return {
        "category": cat_encoder.inverse_transform(cat_pred)[0],
        "priority": pri_encoder.inverse_transform(pri_pred)[0]
    }