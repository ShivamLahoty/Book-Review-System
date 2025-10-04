import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BookDetails from './pages/BookDetails'
import AddBook from './pages/AddBook'
import EditBook from './pages/EditBook'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/books/:id" element={<BookDetails />} />

        <Route path="/add-book" element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        } />
        <Route path="/edit-book/:id" element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
