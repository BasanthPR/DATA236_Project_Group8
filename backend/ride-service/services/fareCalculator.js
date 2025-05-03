const axios = require('axios');

const BASE_FARE = 2.5;
const PER_KM_RATE = 1.5;
const PER_MINUTE_RATE = 0.5;
const SURGE_MULTIPLIER_MAX = 3.0;

exports.calculateFare = async (pickup, dropoff, isActual = false) => {
    try {
        // Calculate distance and duration using external service (e.g., Google Maps)
        const response = await axios.get(`${process.env.MAPS_API_URL}/directions`, {
            params: {
                origin: `${pickup.latitude},${pickup.longitude}`,
                destination: `${dropoff.latitude},${dropoff.longitude}`,
                key: process.env.MAPS_API_KEY
            }
        });

        const { distance, duration } = response.data.routes[0].legs[0];
        const distanceInKm = distance.value / 1000;
        const durationInMinutes = duration.value / 60;

        // Get current surge multiplier from ML service
        const surgeMultiplier = await getSurgeMultiplier(pickup);

        const distanceFare = distanceInKm * PER_KM_RATE;
        const timeFare = durationInMinutes * PER_MINUTE_RATE;
        const totalFare = (BASE_FARE + distanceFare + timeFare) * surgeMultiplier;

        return {
            baseFare: BASE_FARE,
            distanceFare,
            timeFare,
            surgeMultiplier,
            totalFare: Math.round(totalFare * 100) / 100
        };
    } catch (error) {
        console.error('Error calculating fare:', error);
        throw new Error('Failed to calculate fare');
    }
};

async function getSurgeMultiplier(location) {
    try {
        const response = await axios.post(`${process.env.ML_MODEL_API_URL}/predict-surge`, {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date().toISOString()
        });

        return Math.min(response.data.surgeMultiplier, SURGE_MULTIPLIER_MAX);
    } catch (error) {
        console.error('Error getting surge multiplier:', error);
        return 1.0; // Default to no surge if ML service fails
    }
} 