import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import WalkerProfilePage from './pages/WalkerProfilePage'
import BookingPage from './pages/BookingPage'
import TrackingPage from './pages/TrackingPage'
import BookingsPage from './pages/BookingsPage'
import MessagesPage from './pages/MessagesPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/walker/:id" element={<WalkerProfilePage />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
