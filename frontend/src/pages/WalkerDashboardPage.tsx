import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Badge, Card } from '../components/ui'
import { api, type Booking, type WalkerProfile } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useWebSocket } from '../hooks/useWebSocket'

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  pending:     { label: 'ממתין', variant: 'warning' },
  confirmed:   { label: 'אושר', variant: 'success' },
  in_progress: { label: 'בטיול', variant: 'success' },
  completed:   { label: 'הושלם', variant: 'default' },
  cancelled:   { label: 'בוטל', variant: 'danger' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

export default function WalkerDashboardPage() {
  const navigate = useNavigate()
  const { backendToken } = useAuth()
  const { user } = useApp()
  const [profile, setProfile] = useState<WalkerProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [broadcasting, setBroadcasting] = useState(false)
  const watchIdRef = useRef<number | null>(null)
  const { send, connected } = useWebSocket(broadcasting ? backendToken : null)

  useEffect(() => {
    if (!backendToken) return
    Promise.all([
      api.getMyWalkerProfile().catch(() => null),
      api.getWalkerBookings().catch(() => []),
    ]).then(([p, b]) => {
      setProfile(p)
      setBookings(b as Booking[])
    }).finally(() => setLoading(false))
  }, [backendToken])

  async function toggleAvailability() {
    if (!profile) return
    setToggling(true)
    try {
      const updated = await api.updateWalkerProfile({ is_available: !profile.is_available })
      setProfile(updated)
    } finally {
      setToggling(false)
    }
  }

  async function handleStatus(bookingId: number, status: string) {
    try {
      const updated = await api.updateBookingStatus(bookingId, status)
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b))
      if (status === 'completed') stopBroadcast()
    } catch {}
  }

  function startBroadcast() {
    if (!navigator.geolocation) return
    setBroadcasting(true)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        send({ type: 'location_update', lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 },
    )
  }

  function stopBroadcast() {
    setBroadcasting(false)
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  const pending = bookings.filter(b => b.status === 'pending')
  const active = bookings.filter(b => b.status === 'in_progress')
  const upcoming = bookings.filter(b => b.status === 'confirmed')
  const past = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-gray-400">טוען...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24">
        <div className="bg-white border-b border-orange-100 px-5 py-5">
          <h1 className="font-display font-black text-2xl text-gray-900">דשבורד מטייל</h1>
        </div>
        <div className="px-5 py-10 text-center max-w-lg mx-auto">
          <p className="text-5xl mb-4">🦮</p>
          <p className="font-bold text-gray-800 mb-2">עדיין אין לך פרופיל מטייל</p>
          <p className="text-sm text-gray-400 mb-6">צור פרופיל כדי להתחיל לקבל הזמנות</p>
          <button
            onClick={() => navigate('/walker-setup')}
            className="bg-brand-500 text-white font-bold rounded-2xl py-3 px-8"
          >
            צור פרופיל מטייל
          </button>
        </div>
        <WalkerBottomNav active="home" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24">

      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-2xl text-gray-900">שלום, {user.name?.split(' ')[0]} 👋</h1>
            <p className="text-sm text-gray-400 mt-0.5">דשבורד מטייל</p>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={toggling}
            className={`px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              profile.is_available
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {toggling ? '...' : profile.is_available ? '🟢 פנוי' : '🔴 עסוק'}
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5 max-w-lg mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'ממתינות', value: String(pending.length), color: 'text-orange-500' },
            { label: 'פעילות', value: String(active.length), color: 'text-green-500' },
            { label: 'הושלמו', value: String(past.filter(b => b.status === 'completed').length), color: 'text-gray-700' },
          ].map(s => (
            <Card key={s.label} className="text-center">
              <p className={`font-display font-black text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Pending — needs action */}
        {pending.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 mb-3">⏳ ממתינות לאישור</h2>
            <div className="space-y-3">
              {pending.map(b => (
                <Card key={b.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">🐕 {b.dog_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(b.scheduled_start)} · {formatTime(b.scheduled_start)}
                      </p>
                      {b.notes && <p className="text-xs text-gray-500 mt-1 italic">"{b.notes}"</p>}
                    </div>
                    <p className="font-bold text-brand-500">₪{Number(b.total_price).toFixed(0)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(b.id, 'confirmed')}
                      className="flex-1 bg-green-500 text-white font-bold rounded-2xl py-2.5 text-sm hover:bg-green-600 transition-colors"
                    >
                      ✓ קבל
                    </button>
                    <button
                      onClick={() => handleStatus(b.id, 'cancelled')}
                      className="flex-1 bg-white border border-red-200 text-red-500 font-bold rounded-2xl py-2.5 text-sm hover:bg-red-50 transition-colors"
                    >
                      ✕ דחה
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active walk */}
        {active.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 mb-3">🐾 בטיול עכשיו</h2>
            {active.map(b => (
              <Card key={b.id} className="bg-brand-50 border-brand-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">🐕 {b.dog_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatTime(b.scheduled_start)}</p>
                  </div>
                  <button
                    onClick={() => handleStatus(b.id, 'completed')}
                    className="bg-brand-500 text-white font-bold rounded-2xl py-2 px-4 text-sm"
                  >
                    סיים טיול
                  </button>
                </div>

                {/* GPS broadcast toggle */}
                {!broadcasting ? (
                  <button
                    onClick={startBroadcast}
                    disabled={!navigator.geolocation}
                    className="w-full bg-green-500 text-white font-bold rounded-2xl py-2.5 text-sm hover:bg-green-600 transition-colors disabled:opacity-40"
                  >
                    📍 שתף מיקום בזמן אמת
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 bg-green-100 rounded-2xl px-4 py-2.5">
                      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-400'}`} />
                      <span className="text-xs font-semibold text-green-700">
                        {connected ? 'משדר מיקום...' : 'מתחבר...'}
                      </span>
                    </div>
                    <button
                      onClick={stopBroadcast}
                      className="bg-red-100 text-red-600 font-bold rounded-2xl py-2.5 px-4 text-sm hover:bg-red-200 transition-colors"
                    >
                      עצור
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming confirmed */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 mb-3">📅 קרובות</h2>
            <div className="space-y-2">
              {upcoming.map(b => (
                <Card key={b.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">🐕 {b.dog_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(b.scheduled_start)} · {formatTime(b.scheduled_start)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-brand-500 text-sm">₪{Number(b.total_price).toFixed(0)}</p>
                    <button
                      onClick={() => handleStatus(b.id, 'in_progress')}
                      className="bg-green-100 text-green-700 font-bold rounded-xl py-1.5 px-3 text-xs"
                    >
                      התחל
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {pending.length === 0 && active.length === 0 && upcoming.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-5xl mb-3">🐕</p>
            <p className="font-semibold">אין הזמנות פעילות</p>
            <p className="text-sm mt-1">
              {profile.is_available ? 'ממתין להזמנות חדשות...' : 'שנה סטטוס לפנוי כדי לקבל הזמנות'}
            </p>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 mb-3">היסטוריה</h2>
            <div className="space-y-2">
              {past.slice(0, 5).map(b => (
                <Card key={b.id} className="flex items-center gap-3 opacity-70">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">🐕 {b.dog_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(b.scheduled_start)}</p>
                  </div>
                  <Badge variant={statusMap[b.status].variant}>{statusMap[b.status].label}</Badge>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>

      <WalkerBottomNav active="home" />
    </div>
  )
}

export function WalkerBottomNav({ active }: { active: string }) {
  const navigate = useNavigate()
  const items = [
    { icon: '🏠', label: 'דשבורד', key: 'home', path: '/walker-dashboard' },
    { icon: '💬', label: 'הודעות', key: 'messages', path: '/messages' },
    { icon: '👤', label: 'פרופיל', key: 'profile', path: '/walker-profile' },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 flex justify-around py-3 px-6">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className={`text-xs font-semibold ${active === item.key ? 'text-brand-500' : 'text-gray-400'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}
