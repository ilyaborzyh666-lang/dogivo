import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Card, Logo } from '../components/ui'
import { BottomNav } from './BookingsPage'

const walkers = [
  { id: 1, name: 'יונתן כהן', area: 'תל אביב', price: 45, rating: 4.9, reviews: 38, available: true, emoji: '👨' },
  { id: 2, name: 'מיכל לוי', area: 'רמת גן', price: 40, rating: 4.8, reviews: 21, available: true, emoji: '👩' },
  { id: 3, name: 'אורי גולדברג', area: 'הרצליה', price: 50, rating: 5.0, reviews: 14, available: false, emoji: '🧑' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-orange-50 pb-24">

      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-5 py-4 flex items-center justify-between">
        <Logo size="sm" />
        <Avatar name="אני" size="sm" />
      </div>

      <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">

        {/* Greeting */}
        <div>
          <h1 className="font-display font-black text-2xl text-gray-900">שלום! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">מוכן לקבוע טיול לכלב שלך?</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            placeholder="חפש מטייל לפי אזור..."
            className="w-full bg-white border border-orange-100 rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-sm"
          />
        </div>

        {/* Next walk banner */}
        <div
          onClick={() => navigate('/tracking')}
          className="bg-brand-500 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg shadow-orange-200 cursor-pointer active:scale-95 transition-transform"
        >
          <div>
            <p className="text-sm font-semibold opacity-80">הטיול הבא</p>
            <p className="font-display font-black text-xl mt-0.5">מחר בשעה 8:00</p>
            <p className="text-sm opacity-70 mt-1">יונתן כהן · 45 דק׳</p>
          </div>
          <button className="bg-white text-brand-500 font-bold text-sm rounded-2xl px-4 py-2 shadow-sm">
            עקוב Live
          </button>
        </div>

        {/* Walkers */}
        <div>
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">מטיילים בקרבתך</h2>
          <div className="space-y-3">
            {walkers.map(w => (
              <Card
                key={w.id}
                className="flex items-center gap-4 cursor-pointer hover:shadow-md active:scale-95 transition-all"
                onClick={() => navigate(`/walker/${w.id}`)}
              >
                <div className="text-4xl">{w.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900">{w.name}</p>
                    <Badge variant={w.available ? 'success' : 'default'}>
                      {w.available ? 'פנוי' : 'עסוק'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{w.area}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs font-semibold text-gray-700">{w.rating}</span>
                    <span className="text-xs text-gray-400">({w.reviews} ביקורות)</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-brand-500 text-sm">₪{w.price}</p>
                  <p className="text-xs text-gray-400">לטיול</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>

      <BottomNav active="home" />

    </div>
  )
}
