import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Card } from '../components/ui'
import { BottomNav } from './BookingsPage'

const stats = [
  { label: 'טיולים', value: '12' },
  { label: 'כלבים', value: '1' },
  { label: 'מטיילים', value: '3' },
]

const menuItems = [
  { icon: '🐶', label: 'הכלבים שלי', sub: 'מקס · גולדן רטריבר' },
  { icon: '💳', label: 'אמצעי תשלום', sub: 'Visa •••• 4242' },
  { icon: '🔔', label: 'התראות', sub: 'פעיל' },
  { icon: '🔒', label: 'פרטיות ואבטחה', sub: '' },
  { icon: '❓', label: 'עזרה ותמיכה', sub: '' },
]

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <h1 className="font-display font-black text-2xl text-gray-900">הפרופיל שלי</h1>
      </div>

      <div className="px-5 py-6 space-y-5 max-w-lg mx-auto">

        {/* User card */}
        <Card className="flex items-center gap-4">
          <Avatar name="ישראל ישראלי" size="xl" />
          <div className="flex-1">
            <p className="font-display font-black text-xl text-gray-900">ישראל ישראלי</p>
            <p className="text-sm text-gray-400 mt-0.5">israel@example.com</p>
            <Badge className="mt-2">בעל כלב</Badge>
          </div>
          <button className="text-brand-500 text-sm font-semibold">עריכה</button>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <Card key={s.label} className="text-center">
              <p className="font-display font-black text-2xl text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Menu */}
        <Card padded={false}>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-orange-50 active:bg-orange-100 transition-colors text-right ${
                i < menuItems.length - 1 ? 'border-b border-orange-50' : ''
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 text-right">
                <p className="font-semibold text-sm text-gray-800">{item.label}</p>
                {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
              </div>
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </Card>

        {/* Logout */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white border border-red-100 text-red-500 font-bold rounded-2xl py-3.5 text-sm hover:bg-red-50 transition-colors"
        >
          התנתק
        </button>

      </div>

      <BottomNav active="profile" />
    </div>
  )
}
