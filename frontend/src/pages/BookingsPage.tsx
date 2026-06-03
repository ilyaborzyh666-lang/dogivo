import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge, Card } from '../components/ui'
import { api, type Booking } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  pending:     { label: 'ממתין', variant: 'warning' },
  confirmed:   { label: 'קרוב', variant: 'warning' },
  in_progress: { label: 'בטיול', variant: 'success' },
  completed:   { label: 'הושלם', variant: 'success' },
  cancelled:   { label: 'בוטל', variant: 'danger' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

function ReviewModal({ bookingId, onClose, onDone }: { bookingId: number; onClose: () => void; onDone: () => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setLoading(true)
    setError('')
    try {
      await api.leaveReview(bookingId, rating, comment)
      onDone()
    } catch (e: any) {
      setError(typeof e?.message === 'string' ? e.message : 'שגיאה בשליחת הביקורת')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg px-6 py-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display font-black text-xl text-gray-900 text-center">השאר ביקורת 🐾</h2>

        {/* Stars */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => setRating(s)}
              className={`text-4xl transition-transform ${s <= rating ? 'scale-110' : 'opacity-30'}`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          placeholder="ספר על החוויה שלך (אופציונלי)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 font-bold rounded-2xl py-3 text-sm"
          >
            ביטול
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-brand-500 text-white font-bold rounded-2xl py-3 text-sm disabled:opacity-50"
          >
            {loading ? 'שולח...' : 'שלח ביקורת'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const navigate = useNavigate()
  const { backendToken } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null)
  const [reviewed, setReviewed] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!backendToken) return
    api.getBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [backendToken])

  function handleReviewDone() {
    if (reviewBookingId) setReviewed(prev => new Set(prev).add(reviewBookingId))
    setReviewBookingId(null)
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <h1 className="font-display font-black text-2xl text-gray-900">ההזמנות שלי</h1>
      </div>

      <div className="px-5 py-5 space-y-3 max-w-lg mx-auto">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📅</p>
            <p className="font-semibold">אין הזמנות עדיין</p>
            <button onClick={() => navigate('/home')} className="mt-4 text-brand-500 text-sm font-semibold">
              מצא מטייל →
            </button>
          </div>
        ) : (
          bookings.map(b => {
            const s = statusMap[b.status] ?? { label: b.status, variant: 'default' as const }
            const isActive = b.status === 'in_progress'
            const isUpcoming = b.status === 'pending' || b.status === 'confirmed'
            const canReview = b.status === 'completed' && !reviewed.has(b.id)
            return (
              <Card
                key={b.id}
                className={`transition-all ${isActive ? 'border-brand-300 bg-brand-50' : ''}`}
              >
                <div
                  className={`flex items-center gap-3 ${isActive ? 'cursor-pointer' : ''}`}
                  onClick={() => isActive ? navigate('/tracking') : undefined}
                >
                  <div className="text-4xl">🐕</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900">{b.dog_name}</p>
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(b.scheduled_start)} · {formatTime(b.scheduled_start)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-500 text-sm">₪{Number(b.total_price).toFixed(0)}</p>
                    {isActive && <p className="text-xs text-brand-400 mt-0.5">עקוב ›</p>}
                    {isUpcoming && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          api.updateBookingStatus(b.id, 'cancelled')
                            .then(() => setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x)))
                        }}
                        className="text-xs text-red-400 mt-0.5"
                      >
                        ביטול
                      </button>
                    )}
                  </div>
                </div>

                {/* Review button */}
                {canReview && (
                  <button
                    onClick={() => setReviewBookingId(b.id)}
                    className="mt-3 w-full bg-orange-50 border border-orange-200 text-brand-500 font-bold rounded-2xl py-2.5 text-sm hover:bg-orange-100 transition-colors"
                  >
                    ★ השאר ביקורת
                  </button>
                )}
                {reviewed.has(b.id) && (
                  <p className="mt-3 text-center text-sm text-green-500 font-semibold">✓ הביקורת נשלחה</p>
                )}
              </Card>
            )
          })
        )}
      </div>

      {reviewBookingId && (
        <ReviewModal
          bookingId={reviewBookingId}
          onClose={() => setReviewBookingId(null)}
          onDone={handleReviewDone}
        />
      )}

      <BottomNav active="bookings" />
    </div>
  )
}

export function BottomNav({ active }: { active: string }) {
  const navigate = useNavigate()
  const items = [
    { icon: '🏠', label: 'בית', key: 'home', path: '/home' },
    { icon: '📅', label: 'הזמנות', key: 'bookings', path: '/bookings' },
    { icon: '💬', label: 'הודעות', key: 'messages', path: '/messages' },
    { icon: '👤', label: 'פרופיל', key: 'profile', path: '/profile' },
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
