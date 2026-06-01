import { useNavigate } from 'react-router-dom'
import { Badge, Card } from '../components/ui'

const bookings = [
  { id: 1, walker: 'יונתן כהן', emoji: '👨', date: '2026-06-02', time: '08:00', duration: '45 דק׳', price: 45, status: 'upcoming' },
  { id: 2, walker: 'מיכל לוי', emoji: '👩', date: '2026-05-28', time: '17:00', duration: '60 דק׳', price: 45, status: 'completed' },
  { id: 3, walker: 'יונתן כהן', emoji: '👨', date: '2026-05-20', time: '08:00', duration: '45 דק׳', price: 45, status: 'completed' },
  { id: 4, walker: 'אורי גולדברג', emoji: '🧑', date: '2026-05-10', time: '09:00', duration: '30 דק׳', price: 25, status: 'cancelled' },
]

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  upcoming: { label: 'קרוב', variant: 'warning' },
  completed: { label: 'הושלם', variant: 'success' },
  cancelled: { label: 'בוטל', variant: 'danger' },
}

export default function BookingsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <h1 className="font-display font-black text-2xl text-gray-900">ההזמנות שלי</h1>
      </div>

      <div className="px-5 py-5 space-y-3 max-w-lg mx-auto">
        {bookings.map(b => (
          <Card
            key={b.id}
            className="cursor-pointer hover:shadow-md active:scale-95 transition-all"
            onClick={() => b.status === 'upcoming' ? navigate('/tracking') : null}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">{b.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-gray-900">{b.walker}</p>
                  <Badge variant={statusMap[b.status].variant}>{statusMap[b.status].label}</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{b.date} · {b.time} · {b.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-500 text-sm">₪{b.price}</p>
                {b.status === 'upcoming' && (
                  <p className="text-xs text-brand-400 mt-0.5">עקוב ›</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav active="bookings" />
    </div>
  )
}

// re-exported below
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
