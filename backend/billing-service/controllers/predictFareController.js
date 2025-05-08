// import axios from 'axios';

// /**
//  * Controller to handle fare prediction requests.
//  * Sends ride details to FastAPI service and returns predicted fare.
//  */
// export const predictFare = async (req, res) => {
//   try {
//     const {
//       pickup_latitude,
//       pickup_longitude,
//       dropoff_latitude,
//       dropoff_longitude,
//       passenger_count,
//       pickup_datetime
//     } = req.body;

//     if (
//       !pickup_latitude || !pickup_longitude ||
//       !dropoff_latitude || !dropoff_longitude ||
//       !passenger_count || !pickup_datetime
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields for fare prediction."
//       });
//     }

//     const response = await axios.post('http://localhost:8000/predict_fare/', {
//       pickup_latitude,
//       pickup_longitude,
//       dropoff_latitude,
//       dropoff_longitude,
//       passenger_count,
//       pickup_datetime
//     });

//     const predictedFare = response.data.predicted_fare;

//     return res.status(200).json({
//       success: true,
//       predicted_fare: predictedFare
//     });

//   } catch (error) {
//     console.error("❌ Error calling FastAPI fare predictor:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not predict fare. Please try again later."
//     });
//   }
// };
