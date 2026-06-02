import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge, Card, Logo } from '../components/ui'
import { BottomNav } from './BookingsPage'
import { useApp } from '../context/AppContext'
import { api, type WalkerResult } from '../lib/api'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [walkers, setWalkers] = useState<WalkerResult[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.searchWalkers({ city: 'תל אביב' })
      .then(setWalkers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = walkers.filter(w =>
    !search || w.full_name.includes(search) || (w.city ?? '').includes(search)
  )

  return (
    <div className="min-h-screen bg-orange-50 pb-24">

      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-5 py-4 flex items-center justify-between">
        <Logo size="sm" />
        <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
          {(user.name || 'א')[0].toUpperCase()}
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">

        {/* Greeting */}
        <div>
          <h1 className="font-display font-black text-2xl text-gray-900">
            שלום{user.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">מוכן לקבוע טיול לכלב שלך?</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חפש מטייל לפי שם או עיר..."
            className="w-full bg-white border border-orange-100 rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-sm"
          />
        </div>

        {/* Walkers */}
        <div>
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">מטיילים בקרבתך</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🐕</p>
              <p className="text-sm">לא נמצאו מטיילים</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(w => (
                <Card
                  key={w.id}
                  className="flex items-center gap-4 cursor-pointer hover:shadow-md active:scale-95 transition-all"
                  onClick={() => navigate(`/walker/${w.user_id}`)}
                >
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl shrink-0">
                    {w.avatar_url ? (
                      <img src={w.avatar_url} className="w-full h-full rounded-full object-cover" />
                    ) : '🧑'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900">{w.full_name}</p>
                      <Badge variant={w.is_available ? 'success' : 'default'}>
                        {w.is_available ? 'פנוי' : 'עסוק'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      📍 {w.city ?? 'ישראל'}
                      {w.distance_km != null ? ` · ${w.distance_km} ק״מ` : ''}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs font-semibold text-gray-700">{w.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({w.total_reviews} ביקורות)</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-brand-500 text-sm">₪{w.price_per_hour}</p>
                    <p className="text-xs text-gray-400">לשעה</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>

      <BottomNav active="home" />
    </div>
  )
}
