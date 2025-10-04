import { useState, useEffect } from 'react'
import { getBooks } from '../utils/api'
import BookCard from '../components/BookCard'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import { GENRES } from '../constants/genres'

const Home = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [currentPage, genre, sort])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await getBooks(currentPage, search, genre, sort)
      setBooks(data.books)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchBooks()
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Books</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 input-field"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Filter by Genre</label>
            <select
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value)
                setCurrentPage(1)
              }}
              className="input-field"
            >
              <option value="">All Genres</option>
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setCurrentPage(1)
              }}
              className="input-field"
            >
              <option value="">Default</option>
              <option value="year-desc">Year (Newest First)</option>
              <option value="year-asc">Year (Oldest First)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No books found. Try adjusting your search criteria.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Home
