import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button, Card, Input } from '../components/ui'

const TIMES = ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00']
const DURATIONS = [
  { label: '30 דק׳', value: 30, price: 25 },
  { label: '45 דק׳', value: 45, price: 35 },
  { label: '60 דק׳', value: 60, price: 45 },
  { label: '90 דק׳', value: 90, price: 65 },
]

const walkerNames: Record<string, string> = {
  '1': 'יונתן כהן',
  '2': 'מיכל לוי',
  '3': 'אורי גולדברג',
}

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const walkerName = walkerNames[id ?? '1'] ?? 'המטייל'

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(DURATIONS[2])
  const [dogName, setDogName] = useState('')
  const [notes, setNotes] = useState('')

  const canBook = date && time && dogName

  return (
    <div className="min-h-screen bg-orange-50 pb-32">

      {/* Header */}
      <div className="bg-white px-5 py-5 border-b border-orange-100">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-sm font-semibold flex items-center gap-1 mb-3">
          ← חזור
        </button>
        <h1 className="font-display font-black text-2xl text-gray-900">הזמן טיול</h1>
        <p className="text-gray-400 text-sm mt-1">עם {walkerName}</p>
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
                  time === t
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
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
            {DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => setDuration(d)}
                className={`py-3 rounded-2xl text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
                  duration.value === d.value
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                <span>{d.label}</span>
                <span className={`text-xs font-normal ${duration.value === d.value ? 'opacity-80' : 'text-gray-400'}`}>
                  ₪{d.price}
                </span>
              </button>
            ))}
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
                <span className="font-semibold">{walkerName}</span>
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
                <span className="text-brand-500">₪{duration.price}</span>
              </div>
            </div>
          </Card>
        )}

      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <Button
            fullWidth
            size="lg"
            disabled={!canBook}
            onClick={() => navigate('/tracking')}
          >
            {canBook ? `אשר הזמנה · ₪${duration.price}` : 'מלא את כל הפרטים'}
          </Button>
        </div>
      </div>

    </div>
  )
}
