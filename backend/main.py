from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import cv2
import numpy as np
import joblib

from model.preprocess_img import preprocess;


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("./model/model.joblib")




def preprocess_image(image_bytes):
    image_array = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(image_array, cv2.IMREAD_GRAYSCALE)

    image = preprocess(image)
    image = image.flatten().reshape(1, -1)

    return image



@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    image_bytes = await file.read()

    try:
        X = preprocess_image(image_bytes)

        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]

        confidence = float(np.max(probabilities))

        return {
            "prediction": int(prediction),
            "confidence": confidence,
            "probabilities": {
                str(i): float(probabilities[i])
                for i in range(10)
            }
        }

    except Exception as e:
        return {
            "error": str(e)
        }