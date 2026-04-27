import pandas as pd
import torch
import numpy as np
import os
import pickle

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    Trainer,
    TrainingArguments
)


#Load Dataset
df = pd.read_csv("data/ngo_dataset_balanced.csv")

df = df.dropna()

print("Duplicate Text: ", df.duplicated(subset=["text"]).sum())
df = df.drop_duplicates(subset=["text"])

texts = df["text"].tolist()
categories = df["category"].tolist()
priorities = df["priority"].tolist()


#Encode Labels
cat_encoder = LabelEncoder()
pri_encoder = LabelEncoder()

cat_labels = cat_encoder.fit_transform(categories)
pri_labels = pri_encoder.fit_transform(priorities)

# Save encoders
os.makedirs("models", exist_ok=True)

with open("models/cat_encoder.pkl", "wb") as f:
    pickle.dump(cat_encoder, f)

with open("models/pri_encoder.pkl", "wb") as f:
    pickle.dump(pri_encoder, f)


#Train-Test Split
X_train, X_test, y_cat_train, y_cat_test, y_pri_train, y_pri_test = train_test_split(
    texts, cat_labels, pri_labels, test_size=0.2, random_state=42
)


#Tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

def tokenize(texts):
    return tokenizer(texts, padding=True, truncation=True, max_length=128)

train_encodings = tokenize(X_train)
test_encodings = tokenize(X_test)


#Dataset Class
class CustomDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_dataset_cat = CustomDataset(train_encodings, y_cat_train)
test_dataset_cat = CustomDataset(test_encodings, y_cat_test)

train_dataset_pri = CustomDataset(train_encodings, y_pri_train)
test_dataset_pri = CustomDataset(test_encodings, y_pri_test)


#Metrics
def compute_metrics(pred):
    logits, labels = pred
    preds = np.argmax(logits, axis=1)

    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="weighted")
    acc = accuracy_score(labels, preds)

    return {
        "accuracy": acc,
        "f1": f1,
        "precision": precision,
        "recall": recall,
    }


#Training Arguments
training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=2e-5,
    per_device_train_batch_size=4,   
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_dir="./logs",
    load_best_model_at_end=True
)

#Device (GPU/CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)


#CATEGORY MODEL
model_cat = BertForSequenceClassification.from_pretrained(
    "bert-base-uncased",
    num_labels=len(set(cat_labels))
)

trainer_cat = Trainer(
    model=model_cat,
    args=training_args,
    train_dataset=train_dataset_cat,
    eval_dataset=test_dataset_cat,
    compute_metrics=compute_metrics
)

print("Training Category Model...")
trainer_cat.train()

#PRIORITY MODEL
model_pri = BertForSequenceClassification.from_pretrained(
    "bert-base-uncased",
    num_labels=len(set(pri_labels))
)

trainer_pri = Trainer(
    model=model_pri,
    args=training_args,
    train_dataset=train_dataset_pri,
    eval_dataset=test_dataset_pri,
    compute_metrics=compute_metrics
)

print("Training Priority Model...")
trainer_pri.train()

#Save Models
model_cat.save_pretrained("models/category_model")
model_pri.save_pretrained("models/priority_model")
tokenizer.save_pretrained("models/tokenizer")

print("Models saved successfully!")