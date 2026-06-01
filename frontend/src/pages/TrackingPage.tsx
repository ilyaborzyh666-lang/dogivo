import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge, Card } from '../components/ui'

const updates = [
  { time: '08:02', text: 'הטיול התחיל! יוצאים מהבית 🐕', emoji: '🚶' },
  { time: '08:10', text: 'מקס שותה מים בפארק', emoji: '💧' },
  { time: '08:18', text: 'פגשנו כלבים חברים!', emoji: '🐾' },
  { time: '08:25', text: 'מקס עשה צרכיו, הכל בסדר', emoji: '✅' },
]

export default function TrackingPage() {
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [visibleUpdates, setVisibleUpdates] = useState(1)

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(s => s + 1)
      setVisibleUpdates(v => Math.min(v + 1, updates.length))
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const mins = Math.floor(elapsed * 4 / 60)
  const progress = Math.min((elapsed * 4) / 45 * 100, 100)

  return (
    <div className="min-h-screen bg-orange-50 pb-8">

      {/* Header */}
      <div className="bg-brand-500 px-5 pt-10 pb-8 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display font-black text-2xl">🐾 Live Tracking</h1>
            <Badge variant="success" className="bg-green-400 text-white animate-pulse">
              בטיול עכשיו
            </Badge>
          </div>

          {/* Walker */}
          <div className="flex items-center gap-3 bg-white/20 rounded-2xl p-4">
            <div className="text-4xl">👨</div>
            <div>
              <p className="font-bold text-lg">יונתן כהן</p>
              <p className="text-sm opacity-80">טיול של 45 דקות · ₪45</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4 max-w-lg mx-auto">

        {/* Map placeholder */}
        <Card padded={false} className="overflow-hidden">
          <div className="bg-gradient-to-br from-green-100 to-green-200 h-52 flex flex-col items-center justify-center relative">
            <div className="text-6xl animate-bounce">🐕</div>
            <p className="text-green-700 font-bold text-sm mt-2">פארק הירקון, תל אביב</p>
            <p className="text-green-600 text-xs mt-1">מתעדכן בזמן אמת</p>
            <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-bold text-green-700 shadow-sm">
              📍 {(32.0853 + elapsed * 0.00003).toFixed(4)}N
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-gray-700">התקדמות הטיול</span>
            <span className="text-sm font-bold text-brand-500">{mins} / 45 דק׳</span>
          </div>
          <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-left">
            {progress >= 100 ? '🎉 הטיול הסתיים!' : `נותרו ~${45 - mins} דקות`}
          </p>
        </Card>

        {/* Live updates */}
        <div>
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">עדכונים חיים</h2>
          <div className="space-y-2">
            {updates.slice(0, visibleUpdates).map((u, i) => (
              <Card key={i} className="flex items-center gap-3 animate-fade-in">
                <span className="text-2xl">{u.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{u.text}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{u.time}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="bg-white border border-orange-100 rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm hover:bg-orange-50 transition-colors">
            <span className="text-2xl">📞</span>
            <span className="text-sm font-semibold text-gray-700">התקשר</span>
          </button>
          <button className="bg-white border border-orange-100 rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm hover:bg-orange-50 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-sm font-semibold text-gray-700">שלח הודעה</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          חזור לדף הבית
        </button>

      </div>
    </div>
  )
}
