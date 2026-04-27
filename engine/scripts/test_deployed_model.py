from gradio_client import Client
import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

category_client = Client(
    "ayushmishra9449/category-model-api",
    token=HF_TOKEN
)

priority_client = Client(
    "ayushmishra9449/priority-model-api",
    token=HF_TOKEN
)

sentences = [
    "There is a shortage of clean drinking water in the village.",
    "Students need better classroom facilities and learning materials.",
    "A major accident has occurred and injured people need urgent medical help.",
    "Farmers are facing financial problems due to poor crop yield.",
    "Food distribution is required for families affected by recent floods."
]

for text in sentences:
    category = category_client.predict(text, api_name="/predict")
    priority = priority_client.predict(text, api_name="/predict")

    print("\nText:", text)
    print("Category:", category)
    print("Priority:", priority)