// src/pages/ReviewsPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainNavbar from "@/components/MainNavbar";
import { Star, StarHalf } from "lucide-react";

interface Review {
  _id: string;
  driverId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch customer reviews
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4006/api/customer-reviews/my-reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data.reviews);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load your reviews. Please try again later.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [navigate]);

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-yellow-400" />
        ))}
      </div>
    );
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNavbar />

      <main className="flex-1 pt-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Reviews</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
            <p className="text-gray-700">
              You haven't posted any driver reviews yet. After completing a ride, you can rate
              your driver and provide feedback.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-100 p-6 rounded-lg shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {renderStarRating(review.rating)}
                    <p className="text-gray-500 text-sm mt-1">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                
                {review.comment && (
                  <div className="mb-4">
                    <p className="text-gray-800">{review.comment}</p>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                  <p>Driver ID: {review.driverId.substring(0, 8)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewsPage;