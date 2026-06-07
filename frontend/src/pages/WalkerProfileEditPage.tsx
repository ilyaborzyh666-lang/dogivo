import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Card } from '../components/ui'
import { api, type WalkerProfile } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { WalkerBottomNav } from './WalkerDashboardPage'

export default function WalkerProfileEditPage() {
  const navigate = useNavigate()
  const { backendToken } = useAuth()
  const { user } = useApp()
  const [profile, setProfile] = useState<WalkerProfile | null>(null)
  const [bio, setBio] = useState('')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [experience, setExperience] = useState('1')
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (!backendToken) return
    api.getMyWalkerProfile().then(p => {
      if (p) {
        setProfile(p)
        setBio(p.bio ?? '')
        setPrice(String(p.price_per_hour))
        setCity(p.city ?? '')
        setExperience(String(p.years_experience))
        setAvailable(p.is_available)
        if (p.latitude && p.longitude) setCoords({ lat: p.latitude, lon: p.longitude })
      }
    }).finally(() => setLoading(false))
  }, [backendToken])

  function detectLocation() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await api.updateWalkerProfile({
        bio: bio || undefined,
        price_per_hour: Number(price),
        city,
        is_available: available,
        years_experience: Number(experience),
        ...(coords ? { latitude: coords.lat, longitude: coords.lon } : {}),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      setError(e.message ?? 'שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center"><p className="text-gray-400">טוען...</p></div>
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-32">

      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <button onClick={() => navigate('/walker-dashboard')} className="text-gray-500 text-sm font-semibold mb-3 flex items-center gap-1">
          ← חזור
        </button>
        <h1 className="font-display font-black text-2xl text-gray-900">הפרופיל שלי</h1>
      </div>

      <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">

        {/* Info card */}
        <Card className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center text-white font-black text-2xl shrink-0">
            {(user.name || 'מ')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-display font-black text-xl text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full">מטייל</span>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'דירוג', value: profile ? `${profile.rating.toFixed(1)}★` : '—' },
            { label: 'ביקורות', value: String(profile?.total_reviews ?? 0) },
            { label: 'ניסיון', value: `${experience} שנים` },
          ].map(s => (
            <Card key={s.label} className="text-center">
              <p className="font-display font-black text-xl text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Availability */}
        <Card className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-gray-800">סטטוס זמינות</p>
            <p className="text-xs text-gray-400 mt-0.5">{available ? 'מופיע בחיפוש ומקבל הזמנות' : 'לא מופיע בחיפוש'}</p>
          </div>
          <button
            onClick={() => setAvailable(v => !v)}
            className={`w-14 h-7 rounded-full transition-colors relative ${available ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${available ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </Card>

        {/* Price */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">מחיר לשעה</h2>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full bg-orange-50 border border-orange-100 rounded-2xl py-3 pr-8 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </Card>

        {/* City */}
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

        {/* Experience */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">שנות ניסיון</h2>
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', '5'].map(y => (
              <button
                key={y}
                onClick={() => setExperience(y)}
                className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  experience === y ? 'bg-brand-500 text-white' : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {y === '5' ? '5+' : y}
              </button>
            ))}
          </div>
        </Card>

        {/* Bio */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">אודות</h2>
          <textarea
            placeholder="ספר על עצמך — ניסיון, גזעים שאתה אוהב..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          />
        </Card>

        {/* Location */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">מיקום</h2>
          {coords ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-700">מיקום רשום</p>
                <p className="text-xs text-gray-400">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</p>
              </div>
              <button onClick={detectLocation} className="text-xs text-brand-500 font-semibold">עדכן</button>
            </div>
          ) : (
            <button
              onClick={detectLocation}
              disabled={locating || !navigator.geolocation}
              className="w-full bg-orange-50 border border-orange-200 text-brand-500 font-bold rounded-2xl py-3 text-sm hover:bg-orange-100 transition-colors disabled:opacity-40"
            >
              {locating ? '⏳ מאתר מיקום...' : '📍 קבע מיקום נוכחי'}
            </button>
          )}
          <p className="text-xs text-gray-400 mt-2">המיקום עוזר לבעלי כלבים למצוא אותך בחיפוש</p>
        </Card>

        {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-2xl py-3">{error}</p>}

      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-orange-100 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <Button fullWidth size="lg" onClick={handleSave} disabled={saving}>
            {saving ? 'שומר...' : saved ? '✓ נשמר!' : 'שמור שינויים'}
          </Button>
        </div>
      </div>

      <WalkerBottomNav active="profile" />
    </div>
  )
}
