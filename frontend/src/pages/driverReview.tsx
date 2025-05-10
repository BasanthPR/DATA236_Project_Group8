// src/pages/DriverReviewsPage.tsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { driverService } from '@/services/driverService'
import axios from 'axios'

// local type for a single review
interface DriverReview {
  _id:        string
  customerId: string
  rating:     number
  comment:    string
  createdAt:  string
}

export default function DriverReviewsPage() {
  const nav = useNavigate()
  const [reviews, setReviews]   = useState<DriverReview[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string|null>(null)

  useEffect(() => {
    async function loadReviews() {
      setLoading(true)
      try {
        const data = await driverService.getDriverReviews()
        setReviews(data)       // assume service returns array of reviews
      } catch (err: unknown) {
        console.error('Failed to fetch driver reviews', err)
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? 'Failed to load reviews'
            : 'Failed to load reviews'
        )
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reviews…</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => nav(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          My Customer Reviews
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            You haven’t reviewed any customers yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review._id} className="shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Customer ID: {review.customerId}</CardTitle>
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      {review.rating} ★
                    </span>
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {review.comment
                    ? <p className="text-gray-700">{review.comment}</p>
                    : <p className="text-gray-400 italic">No comment</p>
                  }
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
