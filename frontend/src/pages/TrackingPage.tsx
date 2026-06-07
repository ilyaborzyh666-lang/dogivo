import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Badge, Card } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { api, type Booking, type WalkerProfile } from '../lib/api'

// Fix leaflet default marker icons broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DOG_ICON = L.divIcon({
  html: '<div style="font-size:2rem;line-height:1">🐕</div>',
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

function PanTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => { map.panTo([lat, lon]) }, [lat, lon])
  return null
}

interface LocationMsg {
  type: 'walker_location'
  walker_id: number
  booking_id: number
  lat: number
  lon: number
}

export default function TrackingPage() {
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const { backendToken } = useAuth()
  const { lastMessage, connected } = useWebSocket(backendToken)

  const [booking, setBooking] = useState<Booking | null>(null)
  const [walker, setWalker] = useState<WalkerProfile | null>(null)
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null)
  const [lastSeen, setLastSeen] = useState<Date | null>(null)
  const [address, setAddress] = useState<string>('')

  useEffect(() => {
    if (!backendToken || !bookingId) return
    const id = Number(bookingId)
    api.getBooking(id)
      .then(b => {
        setBooking(b)
        return api.getWalker(b.walker_id)
      })
      .then(setWalker)
      .catch(() => {})
  }, [backendToken, bookingId])

  useEffect(() => {
    if (!lastMessage || lastMessage.type !== 'walker_location') return
    const msg = lastMessage as unknown as LocationMsg
    if (bookingId && msg.booking_id !== Number(bookingId)) return
    setPosition({ lat: msg.lat, lon: msg.lon })
    setLastSeen(new Date())

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${msg.lat}&lon=${msg.lon}&format=json&accept-language=he`)
      .then(r => r.json())
      .then(d => {
        const parts = [d.address?.road, d.address?.city || d.address?.town || d.address?.village].filter(Boolean)
        setAddress(parts.join(', '))
      })
      .catch(() => {})
  }, [lastMessage])

  const DEFAULT_CENTER: [number, number] = [32.0853, 34.7818]

  return (
    <div className="min-h-screen bg-orange-50 pb-8">

      {/* Header */}
      <div className="bg-brand-500 px-5 pt-10 pb-8 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display font-black text-2xl">🐾 מעקב חי</h1>
            <Badge
              variant={connected ? 'success' : 'default'}
              className={connected ? 'bg-green-400 text-white animate-pulse' : 'bg-gray-300 text-gray-600'}
            >
              {connected ? 'מחובר' : 'מתחבר...'}
            </Badge>
          </div>

          {/* Walker info */}
          {walker && (
            <div className="flex items-center gap-3 bg-white/20 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                {walker.avatar_url
                  ? <img src={walker.avatar_url} className="w-full h-full object-cover rounded-full" />
                  : <span>{(walker.full_name || '?')[0]}</span>
                }
              </div>
              <div>
                <p className="font-bold text-lg">{walker.full_name}</p>
                <p className="text-sm opacity-80">
                  {booking ? `🐕 ${booking.dog_name} · ₪${Number(booking.total_price).toFixed(0)}` : ''}
                </p>
              </div>
            </div>
          )}

          {lastSeen && (
            <p className="text-sm opacity-70 mt-3">
              עדכון אחרון: {lastSeen.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4 max-w-lg mx-auto">

        {/* Map */}
        <Card padded={false} className="overflow-hidden rounded-3xl">
          <div style={{ height: 320 }}>
            <MapContainer
              center={position ? [position.lat, position.lon] : DEFAULT_CENTER}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              />
              {position && (
                <>
                  <Marker position={[position.lat, position.lon]} icon={DOG_ICON}>
                    <Popup>הכלב נמצא כאן</Popup>
                  </Marker>
                  <PanTo lat={position.lat} lon={position.lon} />
                </>
              )}
            </MapContainer>
          </div>

          {/* Location label */}
          <div className="px-4 py-3 border-t border-orange-100 flex items-center gap-2">
            <span className="text-lg">📍</span>
            <div className="flex-1 min-w-0">
              {position ? (
                <>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {address || `${position.lat.toFixed(4)}°N, ${position.lon.toFixed(4)}°E`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  {connected ? 'ממתין לעדכון מיקום מהמטייל...' : 'מתחבר לשרת...'}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Waiting hint */}
        {!position && connected && (
          <Card>
            <div className="text-center py-3">
              <p className="text-3xl mb-2">📡</p>
              <p className="text-sm text-gray-600 font-semibold">ממתין לשידור מיקום מהמטייל</p>
              <p className="text-xs text-gray-400 mt-1">המטייל צריך להפעיל שיתוף מיקום בדשבורד שלו</p>
            </div>
          </Card>
        )}

        <button
          onClick={() => navigate('/bookings')}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          ← חזור להזמנות
        </button>

      </div>
    </div>
  )
}
