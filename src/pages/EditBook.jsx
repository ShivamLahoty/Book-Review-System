import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookById, updateBook } from '../utils/api'
import { GENRES } from '../constants/genres'
import Loader from '../components/Loader'

const EditBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    publishedYear: new Date().getFullYear()
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const data = await getBookById(id)
      setFormData({
        title: data.book.title,
        author: data.book.author,
        description: data.book.description,
        genre: data.book.genre,
        publishedYear: data.book.publishedYear
      })
    } catch (error) {
      setError('Failed to load book')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      await updateBook(id, formData)
      navigate(`/books/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <Loader />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Book</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="5"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Genre *
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select a genre</option>
              {GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Published Year *
            </label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear()}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Updating...' : 'Update Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/books/${id}`)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBook
