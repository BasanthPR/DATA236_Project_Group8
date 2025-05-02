from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from math import radians, cos, sin, asin, sqrt
import numpy as np
import joblib

app = FastAPI()
model = joblib.load("fare_predictor.pkl")  # same folder

class RideRequest(BaseModel):
    pickup_latitude: float
    pickup_longitude: float
    dropoff_latitude: float
    dropoff_longitude: float
    passenger_count: int
    pickup_datetime: str  # format: "YYYY-MM-DD HH:MM:SS"

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of earth in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def extract_features(data: dict):
    dist = haversine_distance(
        data['pickup_latitude'], data['pickup_longitude'],
        data['dropoff_latitude'], data['dropoff_longitude']
    )
    dt = datetime.strptime(data['pickup_datetime'], "%Y-%m-%d %H:%M:%S")
    return np.array([
        data['pickup_longitude'],
        data['pickup_latitude'],
        data['dropoff_longitude'],
        data['dropoff_latitude'],
        data['passenger_count'],
        dist,
        dt.hour,
        dt.weekday(),
        dt.month
    ]).reshape(1, -1)

@app.post("/predict_fare/")
def predict_fare(req: RideRequest):
    features = extract_features(req.dict())
    fare = model.predict(features)[0]
    return {"predicted_fare": round(float(fare), 2)}
