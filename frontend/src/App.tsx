import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import WalkerProfilePage from './pages/WalkerProfilePage'
import BookingPage from './pages/BookingPage'
import TrackingPage from './pages/TrackingPage'
import BookingsPage from './pages/BookingsPage'
import MessagesPage from './pages/MessagesPage'
import ProfilePage from './pages/ProfilePage'
import SimpleSettingsPage from './pages/SimpleSettingsPage'
import EditProfilePage from './pages/EditProfilePage'
import EditDogPage from './pages/EditDogPage'
import AboutPage from './pages/AboutPage'
import WalkerDashboardPage from './pages/WalkerDashboardPage'
import WalkerSetupPage from './pages/WalkerSetupPage'

export default function App() {
  return (
    <AuthProvider>
    <AppProvider>
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
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/my-dogs" element={<SimpleSettingsPage />} />
        <Route path="/edit-dog" element={<EditDogPage />} />
        <Route path="/payment" element={<SimpleSettingsPage />} />
        <Route path="/notifications" element={<SimpleSettingsPage />} />
        <Route path="/security" element={<SimpleSettingsPage />} />
        <Route path="/help" element={<SimpleSettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/walker-dashboard" element={<WalkerDashboardPage />} />
        <Route path="/walker-setup" element={<WalkerSetupPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </AppProvider>
    </AuthProvider>
  )
}
