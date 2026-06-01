import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from '../components/ui'
import { BottomNav } from './BookingsPage'
import { useApp } from '../context/AppContext'

function DogsContent() {
  const navigate = useNavigate()
  const { dog } = useApp()
  return (
    <Card className="flex items-center gap-4">
      {dog.photo
        ? <img src={dog.photo} alt={dog.name} className="w-14 h-14 rounded-2xl object-cover" />
        : <span className="text-5xl">🐕</span>
      }
      <div className="flex-1">
        <p className="font-bold text-gray-900">{dog.name}</p>
        <p className="text-sm text-gray-400">{dog.breed} · {dog.age} שנים</p>
        <p className="text-xs text-brand-500 mt-1">{dog.gender} · {dog.size}</p>
      </div>
      <button
        onClick={() => navigate('/edit-dog')}
        className="text-brand-500 text-sm font-semibold"
      >
        עריכה
      </button>
    </Card>
  )
}

const config: Record<string, { title: string; icon: string; content: React.ReactNode }> = {
  '/my-dogs': {
    title: 'הכלבים שלי', icon: '🐶',
    content: <DogsContent />,
  },
  '/payment': {
    title: 'אמצעי תשלום', icon: '💳',
    content: (
      <Card className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl w-14 h-10 flex items-center justify-center">
          <span className="text-white text-xs font-bold">VISA</span>
        </div>
        <div>
          <p className="font-bold text-gray-900">Visa •••• 4242</p>
          <p className="text-sm text-gray-400">פג תוקף 12/27</p>
        </div>
        <span className="mr-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">ראשי</span>
      </Card>
    ),
  },
  '/notifications': {
    title: 'התראות', icon: '🔔',
    content: (
      <Card padded={false}>
        {[
          { label: 'עדכוני טיול בזמן אמת', on: true },
          { label: 'תזכורות הזמנה', on: true },
          { label: 'הודעות ממטיילים', on: true },
          { label: 'מבצעים והטבות', on: false },
        ].map((item, i, arr) => (
          <div key={item.label} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? 'border-b border-orange-50' : ''}`}>
            <span className="text-sm font-semibold text-gray-800">{item.label}</span>
            <div className={`w-11 h-6 rounded-full transition-colors ${item.on ? 'bg-brand-500' : 'bg-gray-200'} relative`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.on ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </Card>
    ),
  },
  '/security': {
    title: 'פרטיות ואבטחה', icon: '🔒',
    content: (
      <div className="space-y-3">
        <Card>
          <p className="font-semibold text-sm text-gray-800 mb-1">שינוי סיסמה</p>
          <p className="text-xs text-gray-400">עודכנה לפני 3 חודשים</p>
        </Card>
        <Card>
          <p className="font-semibold text-sm text-gray-800 mb-1">אימות דו-שלבי</p>
          <p className="text-xs text-green-500 font-medium">פעיל</p>
        </Card>
        <Card>
          <p className="font-semibold text-sm text-gray-800 mb-1">מחיקת חשבון</p>
          <p className="text-xs text-red-400">פעולה בלתי הפיכה</p>
        </Card>
      </div>
    ),
  },
  '/help': {
    title: 'עזרה ותמיכה', icon: '❓',
    content: (
      <div className="space-y-3">
        {[
          { q: 'איך מבטלים הזמנה?', a: 'ניתן לבטל עד 2 שעות לפני הטיול ללא עלות.' },
          { q: 'איך משלמים?', a: 'התשלום מתבצע דרך האפליקציה בכרטיס אשראי בלבד.' },
          { q: 'מה קורה אם המטייל לא מגיע?', a: 'תקבל החזר מלא ונסייע לך למצוא מחליף.' },
        ].map((item, i) => (
          <Card key={i}>
            <p className="font-semibold text-sm text-gray-900 mb-1">{item.q}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
          </Card>
        ))}
      </div>
    ),
  },
}

export default function SimpleSettingsPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const page = config[pathname] ?? config['/help']

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white border-b border-orange-100 px-5 py-5 flex items-center gap-3">
        <button onClick={() => navigate('/profile')} className="text-gray-500 font-semibold text-sm">←</button>
        <h1 className="font-display font-black text-xl text-gray-900">{page.icon} {page.title}</h1>
      </div>
      <div className="px-5 py-5 max-w-lg mx-auto space-y-4">
        {page.content}
      </div>
      <BottomNav active="profile" />
    </div>
  )
}
