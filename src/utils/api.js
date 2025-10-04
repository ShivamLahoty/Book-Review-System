import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth APIs
export const signup = async (name, email, password) => {
  const response = await api.post('/auth/signup', { name, email, password })
  return response.data
}

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

// Book APIs
export const getBooks = async (page = 1, search = '', genre = '', sort = '') => {
  const response = await api.get('/books', {
    params: { page, search, genre, sort }
  })
  return response.data
}

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`)
  return response.data
}

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData)
  return response.data
}

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData)
  return response.data
}

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`)
  return response.data
}

// Review APIs
export const getReviews = async (bookId) => {
  const response = await api.get(`/reviews/${bookId}`)
  return response.data
}

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData)
  return response.data
}

export const updateReview = async (id, reviewData) => {
  const response = await api.put(`/reviews/${id}`, reviewData)
  return response.data
}

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`)
  return response.data
}

// User APIs
export const getUserProfile = async () => {
  const response = await api.get('/users/profile')
  return response.data
}

export default api
