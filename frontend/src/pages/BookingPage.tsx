import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Card, Input } from '../components/ui'
import { api, type WalkerProfile } from '../lib/api'
import { useApp } from '../context/AppContext'

const TIMES = ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00']
const DURATIONS = [
  { label: '30 דק׳', minutes: 30 },
  { label: '45 דק׳', minutes: 45 },
  { label: '60 דק׳', minutes: 60 },
  { label: '90 דק׳', minutes: 90 },
]

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dog } = useApp()
  const [walker, setWalker] = useState<WalkerProfile | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(DURATIONS[2])
  const [dogName, setDogName] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (dog.name) setDogName(dog.name)
  }, [dog.name])

  useEffect(() => {
    if (!id) return
    api.getWalker(Number(id)).then(setWalker).catch(() => {})
  }, [id])

  const pricePerHour = walker?.price_per_hour ?? 0
  const totalPrice = Math.round(pricePerHour * duration.minutes / 60)
  const canBook = date && time && dogName

  async function handleBook() {
    if (!canBook || !walker) return
    setLoading(true)
    setError('')
    try {
      const [hours, mins] = time.split(':').map(Number)
      const start = new Date(date)
      start.setHours(hours, mins, 0, 0)
      const end = new Date(start.getTime() + duration.minutes * 60 * 1000)

      await api.createBooking({
        walker_id: walker.user_id,
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        dog_name: dogName,
        notes: notes || undefined,
      })
      navigate('/bookings')
    } catch (e: any) {
      setError(e.message ?? 'שגיאה ביצירת ההזמנה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-32">

      {/* Header */}
      <div className="bg-white px-5 py-5 border-b border-orange-100">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-sm font-semibold flex items-center gap-1 mb-3">
          ← חזור
        </button>
        <h1 className="font-display font-black text-2xl text-gray-900">הזמן טיול</h1>
        <p className="text-gray-400 text-sm mt-1">עם {walker?.full_name ?? '...'}</p>
      </div>

      <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">

        {/* Date */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">תאריך</h2>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-orange-50 border border-orange-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </Card>

        {/* Time */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">שעה</h2>
          <div className="grid grid-cols-4 gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  time === t ? 'bg-brand-500 text-white shadow-sm' : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* Duration */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">משך הטיול</h2>
          <div className="grid grid-cols-2 gap-2">
            {DURATIONS.map(d => {
              const price = Math.round(pricePerHour * d.minutes / 60)
              return (
                <button
                  key={d.minutes}
                  onClick={() => setDuration(d)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
                    duration.minutes === d.minutes ? 'bg-brand-500 text-white shadow-sm' : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  <span>{d.label}</span>
                  {pricePerHour > 0 && (
                    <span className={`text-xs font-normal ${duration.minutes === d.minutes ? 'opacity-80' : 'text-gray-400'}`}>
                      ₪{price}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Dog details */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">פרטי הכלב</h2>
          <div className="space-y-3">
            <Input
              label="שם הכלב"
              placeholder="למשל: מקס"
              value={dogName}
              onChange={e => setDogName(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">הערות למטייל (אופציונלי)</label>
              <textarea
                placeholder="למשל: מקס לא מסתדר עם חתולים..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Summary */}
        {canBook && (
          <Card className="bg-orange-50 border-orange-200">
            <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">סיכום</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">מטייל</span>
                <span className="font-semibold">{walker?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">תאריך</span>
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">שעה</span>
                <span className="font-semibold">{time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">משך</span>
                <span className="font-semibold">{duration.label}</span>
              </div>
              <div className="h-px bg-orange-200 my-1" />
              <div className="flex justify-between font-bold text-base">
                <span>סה״כ לתשלום</span>
                <span className="text-brand-500">₪{totalPrice}</span>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 rounded-2xl py-3 px-4">{error}</p>
        )}

      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <Button
            fullWidth
            size="lg"
            disabled={!canBook || loading}
            onClick={handleBook}
          >
            {loading ? 'שולח...' : canBook ? `אשר הזמנה · ₪${totalPrice}` : 'מלא את כל הפרטים'}
          </Button>
        </div>
      </div>

    </div>
  )
}
