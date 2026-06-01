import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card } from '../components/ui'

const walkers: Record<string, {
  id: string; name: string; area: string; price: number; rating: number
  reviews: number; available: boolean; emoji: string; about: string
  walks: number; dogs: string[]; hours: string
}> = {
  '1': {
    id: '1', name: 'יונתן כהן', area: 'תל אביב', price: 45, rating: 4.9,
    reviews: 38, available: true, emoji: '👨',
    about: 'מטייל כלבים מוסמך עם ניסיון של 4 שנים. אוהב כלבים מכל הגזעים ומתמחה בכלבים גדולים.',
    walks: 312, dogs: ['גולדן', 'לברדור', 'הסקי', 'בולדוג'],
    hours: '07:00 – 20:00',
  },
  '2': {
    id: '2', name: 'מיכל לוי', area: 'רמת גן', price: 40, rating: 4.8,
    reviews: 21, available: true, emoji: '👩',
    about: 'סטודנטית לוטרינריה, מטיילת כלבים 3 שנים. מדווחת על כל טיול עם תמונות.',
    walks: 180, dogs: ['פודל', 'שיצו', 'מאלטז', 'צ׳יוואווה'],
    hours: '06:30 – 19:00',
  },
  '3': {
    id: '3', name: 'אורי גולדברג', area: 'הרצליה', price: 50, rating: 5.0,
    reviews: 14, available: false, emoji: '🧑',
    about: 'מאלף כלבים מקצועי. מתמחה בכלבים עם צרכים מיוחדים ובעיות התנהגות.',
    walks: 95, dogs: ['רועה גרמני', 'דובי', 'ביגל'],
    hours: '08:00 – 18:00',
  },
}

const reviews = [
  { name: 'דנה כ.', text: 'מדהים! שלח תמונות כל 10 דקות. הכלב שלי אוהב אותו.', rating: 5 },
  { name: 'רון מ.', text: 'אמין, בזמן, ומקצועי. ממליץ בחום!', rating: 5 },
  { name: 'שירה ל.', text: 'טיפל בכלב שלנו בעדינות. נחזור בטח.', rating: 5 },
]

export default function WalkerProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const w = walkers[id ?? '1'] ?? walkers['1']

  return (
    <div className="min-h-screen bg-orange-50 pb-32">

      {/* Hero */}
      <div className="bg-white px-5 pt-5 pb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 text-sm font-semibold mb-4 flex items-center gap-1"
        >
          ← חזור
        </button>

        <div className="flex items-center gap-4">
          <div className="text-7xl">{w.emoji}</div>
          <div>
            <h1 className="font-display font-black text-2xl text-gray-900">{w.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">📍 {w.area}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={w.available ? 'success' : 'default'}>
                {w.available ? 'פנוי עכשיו' : 'לא פנוי'}
              </Badge>
              <span className="text-yellow-400 text-sm">★ {w.rating}</span>
              <span className="text-xs text-gray-400">({w.reviews})</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'טיולים', value: w.walks },
            { label: 'דירוג', value: `${w.rating}★` },
            { label: 'מחיר', value: `₪${w.price}` },
          ].map(s => (
            <div key={s.label} className="bg-orange-50 rounded-2xl p-3 text-center">
              <p className="font-display font-black text-xl text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">

        {/* About */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">אודות</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{w.about}</p>
        </Card>

        {/* Details */}
        <Card>
          <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">פרטים</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">שעות פעילות</span>
              <span className="font-semibold text-gray-800">{w.hours}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">גזעים מועדפים</span>
              <span className="font-semibold text-gray-800">{w.dogs.join(', ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">מחיר לטיול</span>
              <span className="font-semibold text-brand-500">₪{w.price}</span>
            </div>
          </div>
        </Card>

        {/* Reviews */}
        <div>
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">ביקורות</h2>
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-gray-600">{r.text}</p>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-5 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1">
            💬 שלח הודעה
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => navigate(`/book/${w.id}`)}
            disabled={!w.available}
          >
            📅 הזמן טיול
          </Button>
        </div>
      </div>

    </div>
  )
}
