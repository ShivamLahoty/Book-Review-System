import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { getUserProfile } from '../utils/api'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/Loader'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile()
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <p className="text-gray-600">Name: {user?.name}</p>
        <p className="text-gray-600">Email: {user?.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">My Books</h2>
        {profileData?.books?.length === 0 ? (
          <p className="text-gray-500">You haven't added any books yet.</p>
        ) : (
          <div className="space-y-4">
            {profileData?.books?.map(book => (
              <div key={book._id} className="border-b pb-4">
                <Link to={`/books/${book._id}`} className="text-blue-600 hover:underline">
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                </Link>
                <p className="text-gray-600 text-sm">by {book.author}</p>
                <p className="text-gray-500 text-sm">{book.genre} • {book.publishedYear}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
        {profileData?.reviews?.length === 0 ? (
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {profileData?.reviews?.map(review => (
              <div key={review._id} className="border-b pb-4">
                <Link to={`/books/${review.bookId._id}`} className="text-blue-600 hover:underline">
                  <h3 className="font-semibold">{review.bookId.title}</h3>
                </Link>
                <div className="text-yellow-500 text-sm my-1">
                  {'⭐'.repeat(review.rating)}
                </div>
                <p className="text-gray-700 text-sm">{review.reviewText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
