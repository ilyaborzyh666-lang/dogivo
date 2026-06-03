import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button, Card } from '../components/ui'
import { api } from '../lib/api'

export default function WalkerSetupPage() {
  const navigate = useNavigate()
  const [bio, setBio] = useState('')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('תל אביב')
  const [experience, setExperience] = useState('1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!price || !city) { setError('מלא מחיר ועיר'); return }
    setLoading(true)
    setError('')
    try {
      await api.createWalkerProfile({
        bio: bio || undefined,
        price_per_hour: Number(price),
        city,
        is_available: true,
        years_experience: Number(experience),
      })
      navigate('/walker-dashboard')
    } catch (e: any) {
      setError(e.message ?? 'שגיאה ביצירת הפרופיל')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-32">

      <div className="bg-white px-5 py-5 border-b border-orange-100">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-sm font-semibold mb-3 flex items-center gap-1">
          ← חזור
        </button>
        <h1 className="font-display font-black text-2xl text-gray-900">צור פרופיל מטייל</h1>
        <p className="text-gray-400 text-sm mt-1">מלא את הפרטים כדי להתחיל לקבל הזמנות</p>
      </div>

      <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">

        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">מחיר לשעה</h2>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
            <input
              type="number"
              placeholder="45"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full bg-orange-50 border border-orange-100 rounded-2xl py-3 pr-8 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">עיר פעילות</h2>
          <div className="grid grid-cols-3 gap-2">
            {['תל אביב', 'רמת גן', 'הרצליה', 'פתח תקווה', 'רעננה', 'אחר'].map(c => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  city === c ? 'bg-brand-500 text-white' : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">שנות ניסיון</h2>
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', '5+'].map(y => (
              <button
                key={y}
                onClick={() => setExperience(y === '5+' ? '5' : y)}
                className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  experience === (y === '5+' ? '5' : y) ? 'bg-brand-500 text-white' : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">אודות (אופציונלי)</h2>
          <textarea
            placeholder="ספר על עצמך — ניסיון, גזעים שאתה אוהב..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          />
        </Card>

        {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-2xl py-3 px-4">{error}</p>}

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <Button fullWidth size="lg" onClick={handleCreate} disabled={loading}>
            {loading ? 'יוצר פרופיל...' : 'צור פרופיל וצא לעבוד 🐾'}
          </Button>
        </div>
      </div>

    </div>
  )
}
