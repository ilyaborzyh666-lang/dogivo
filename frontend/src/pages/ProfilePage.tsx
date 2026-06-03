import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Avatar, Badge, Card } from '../components/ui'
import { BottomNav } from './BookingsPage'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

const menuItems = [
  { icon: '🐶', label: 'הכלבים שלי', sub: '', path: '/my-dogs' },
  { icon: '💳', label: 'אמצעי תשלום', sub: '', path: '/payment' },
  { icon: '🔔', label: 'התראות', sub: 'פעיל', path: '/notifications' },
  { icon: '🔒', label: 'פרטיות ואבטחה', sub: '', path: '/security' },
  { icon: '❓', label: 'עזרה ותמיכה', sub: '', path: '/help' },
  { icon: 'ℹ️', label: 'אודות Dogivo', sub: 'גרסה 1.0.0', path: '/about' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, dog } = useApp()
  const { logout, backendToken } = useAuth()
  const [bookingCount, setBookingCount] = useState(0)

  useEffect(() => {
    if (!backendToken) return
    api.getBookings()
      .then(b => setBookingCount(b.filter(x => x.status === 'completed').length))
      .catch(() => {})
  }, [backendToken])

  const stats = [
    { label: 'טיולים', value: String(bookingCount) },
    { label: 'כלבים', value: dog.name ? '1' : '0' },
    { label: 'מטיילים', value: '0' },
  ]

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <h1 className="font-display font-black text-2xl text-gray-900">הפרופיל שלי</h1>
      </div>

      <div className="px-5 py-6 space-y-5 max-w-lg mx-auto">

        {/* User card */}
        <Card className="flex items-center gap-4">
          <Avatar src={user.photo} name={user.name} size="xl" />
          <div className="flex-1">
            <p className="font-display font-black text-xl text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            <Badge className="mt-2">בעל כלב</Badge>
          </div>
          <button onClick={() => navigate('/edit-profile')} className="text-brand-500 text-sm font-semibold">עריכה</button>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <Card key={s.label} className="text-center">
              <p className="font-display font-black text-2xl text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Menu */}
        <Card padded={false}>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-orange-50 active:bg-orange-100 transition-colors text-right ${
                i < menuItems.length - 1 ? 'border-b border-orange-50' : ''
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 text-right">
                <p className="font-semibold text-sm text-gray-800">{item.label}</p>
                {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
              </div>
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </Card>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-100 text-red-500 font-bold rounded-2xl py-3.5 text-sm hover:bg-red-50 transition-colors"
        >
          התנתק
        </button>

      </div>

      <BottomNav active="profile" />
    </div>
  )
}
