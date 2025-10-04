import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { deleteReview } from '../utils/api'

const ReviewCard = ({ review, onDelete, onEdit }) => {
  const { user } = useContext(AuthContext)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user && review.userId._id === user.id

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setIsDeleting(true)
        await deleteReview(review._id)
        onDelete(review._id)
      } catch (error) {
        alert('Failed to delete review')
        setIsDeleting(false)
      }
    }
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">
            {review.userId.name}
          </p>
          <div className="text-yellow-500 text-sm">
            {renderStars(review.rating)}
          </div>
        </div>
        
        {isOwner && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(review)}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 text-sm hover:underline"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-700 text-sm">
        {review.reviewText}
      </p>
      
      <p className="text-xs text-gray-500 mt-2">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}

export default ReviewCard
