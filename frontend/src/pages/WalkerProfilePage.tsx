import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge, Button, Card } from '../components/ui'
import { api, type WalkerProfile } from '../lib/api'

export default function WalkerProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [walker, setWalker] = useState<WalkerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.getWalker(Number(id))
      .then(setWalker)
      .catch(() => navigate(-1))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-orange-50 flex items-center justify-center"><p className="text-gray-400">טוען...</p></div>
  }

  if (!walker) return null

  return (
    <div className="min-h-screen bg-orange-50 pb-32">

      {/* Hero */}
      <div className="bg-white px-5 pt-5 pb-6 relative">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-sm font-semibold mb-4 flex items-center gap-1">
          ← חזור
        </button>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
            {walker.avatar_url
              ? <img src={walker.avatar_url} className="w-full h-full object-cover" />
              : <span>{(walker.full_name || '?')[0]}</span>
            }
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-gray-900">{walker.full_name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">📍 {walker.city ?? 'ישראל'}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={walker.is_available ? 'success' : 'default'}>
                {walker.is_available ? 'פנוי עכשיו' : 'לא פנוי'}
              </Badge>
              <span className="text-yellow-400 text-sm">★ {walker.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({walker.total_reviews})</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'ניסיון', value: `${walker.years_experience} שנים` },
            { label: 'דירוג', value: `${walker.rating.toFixed(1)}★` },
            { label: 'מחיר', value: `₪${walker.price_per_hour}` },
          ].map(s => (
            <div key={s.label} className="bg-orange-50 rounded-2xl p-3 text-center">
              <p className="font-display font-black text-lg text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">

        {/* About */}
        {walker.bio && (
          <Card>
            <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">אודות</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{walker.bio}</p>
          </Card>
        )}

        {/* Details */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">פרטים</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">עיר</span>
              <span className="font-semibold text-gray-800">{walker.city ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ניסיון</span>
              <span className="font-semibold text-gray-800">{walker.years_experience} שנים</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">מחיר לשעה</span>
              <span className="font-semibold text-brand-500">₪{walker.price_per_hour}</span>
            </div>
          </div>
        </Card>

        {/* Reviews placeholder */}
        {walker.total_reviews === 0 && (
          <Card>
            <p className="text-sm text-gray-400 text-center py-2">אין ביקורות עדיין</p>
          </Card>
        )}

      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate(`/book/${walker.user_id}`)}
            disabled={!walker.is_available}
          >
            {walker.is_available ? '📅 הזמן טיול' : 'לא פנוי כרגע'}
          </Button>
        </div>
      </div>

    </div>
  )
}
