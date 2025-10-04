import { Link } from 'react-router-dom'

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {book.title}
      </h3>
      <p className="text-gray-600 mb-1">by {book.author}</p>
      <p className="text-sm text-gray-500 mb-2">{book.genre}</p>
      <p className="text-sm text-gray-500 mb-3">Published: {book.publishedYear}</p>
      
      {book.averageRating && (
        <div className="flex items-center mb-3">
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="text-sm font-medium">
            {book.averageRating.toFixed(1)} / 5
          </span>
        </div>
      )}

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {book.description}
      </p>

      <Link
        to={`/books/${book._id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  )
}

export default BookCard
