import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBookById, deleteBook, createReview, updateReview } from '../utils/api'
import { AuthContext } from '../context/AuthContext'
import ReviewCard from '../components/ReviewCard'
import Loader from '../components/Loader'

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useContext(AuthContext)
  
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  })

  useEffect(() => {
    fetchBookDetails()
  }, [id])

  const fetchBookDetails = async () => {
    try {
      const data = await getBookById(id)
      setBook(data.book)
      setReviews(data.reviews)
    } catch (error) {
      console.error('Error fetching book:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id)
        navigate('/')
      } catch (error) {
        alert('Failed to delete book')
      }
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingReview) {
        await updateReview(editingReview._id, reviewForm)
      } else {
        await createReview({
          bookId: id,
          ...reviewForm
        })
      }
      
      setReviewForm({ rating: 5, reviewText: '' })
      setShowReviewForm(false)
      setEditingReview(null)
      fetchBookDetails()
    } catch (error) {
      alert('Failed to submit review')
    }
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    setReviewForm({
      rating: review.rating,
      reviewText: review.reviewText
    })
    setShowReviewForm(true)
  }

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter(r => r._id !== reviewId))
  }

  if (loading) return <Loader />

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Book not found</p>
      </div>
    )
  }

  const isOwner = user && book.addedBy._id === user.id
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
            <p className="text-gray-500">{book.genre} • Published {book.publishedYear}</p>
          </div>
          
          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/edit-book/${book._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </Link>
              <button
                onClick={handleDeleteBook}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <span className="text-2xl font-bold text-yellow-500">⭐ {averageRating}</span>
          <span className="text-gray-600 ml-2">({reviews.length} reviews)</span>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{book.description}</p>
        </div>

        <p className="text-sm text-gray-500">
          Added by: {book.addedBy.name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          
          {isAuthenticated && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mb-6 bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-3">
              {editingReview ? 'Edit Review' : 'Write Your Review'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                className="input-field"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Review</label>
              <textarea
                value={reviewForm.reviewText}
                onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                className="input-field"
                rows="4"
                required
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingReview ? 'Update Review' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false)
                  setEditingReview(null)
                  setReviewForm({ rating: 5, reviewText: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div>
            {reviews.map(review => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={handleDeleteReview}
                onEdit={handleEditReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetails
