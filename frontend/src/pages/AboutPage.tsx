import { useNavigate } from 'react-router-dom'
import { Logo, Card } from '../components/ui'

const features = [
  { icon: '🐾', title: 'מטיילים מאומתים', desc: 'כל מטייל עובר בדיקת רקע ואימות זהות לפני שמתחיל לעבוד' },
  { icon: '📍', title: 'מעקב בזמן אמת', desc: 'עקבו אחרי הטיול של הכלב שלכם על המפה בשידור חי' },
  { icon: '💬', title: 'תקשורת ישירה', desc: 'שלחו הודעות למטיילים ותקבלו עדכונים ותמונות מהטיול' },
  { icon: '⭐', title: 'דירוגים וביקורות', desc: 'קראו חוות דעת אמיתיות מבעלי כלבים אחרים באזורכם' },
]

const stats = [
  { value: '2,000+', label: 'בעלי כלבים' },
  { value: '300+', label: 'מטיילים פעילים' },
  { value: '15,000+', label: 'טיולים בוצעו' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div dir="rtl" className="min-h-screen bg-orange-50">

      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-5 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-2xl leading-none">‹</button>
        <h1 className="font-display font-black text-2xl text-gray-900">אודות Dogivo</h1>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-lg mx-auto pb-12">

        {/* Hero */}
        <Card className="flex flex-col items-center text-center gap-4 py-8">
          <Logo size="lg" />
          <p className="text-gray-500 text-base leading-relaxed max-w-xs">
            הפלטפורמה המובילה בישראל לחיבור בין בעלי כלבים למטיילים מקצועיים ומהימנים
          </p>
          <div className="text-5xl">🐕</div>
        </Card>

        {/* Mission */}
        <Card>
          <h2 className="font-display font-black text-xl text-gray-900 mb-2">המשימה שלנו</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            ב-Dogivo אנחנו מאמינים שכל כלב מגיע לטיול בטוח ומהנה. יצרנו פלטפורמה שמחברת בין בעלי
            כלבים לבין מטיילים מוסמכים ואמינים — כך שתוכלו להיות רגועים בזמן שהכלב שלכם נהנה.
          </p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <Card key={s.label} className="text-center">
              <p className="font-display font-black text-2xl text-brand-500">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div>
          <h2 className="font-display font-black text-xl text-gray-900 mb-3">למה Dogivo?</h2>
          <Card padded={false}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`flex items-start gap-4 px-5 py-4 ${i < features.length - 1 ? 'border-b border-orange-50' : ''}`}
              >
                <span className="text-2xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Contact */}
        <Card>
          <h2 className="font-display font-black text-xl text-gray-900 mb-3">צור קשר</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <p className="text-sm text-gray-600">support@dogivo.co.il</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🌐</span>
              <p className="text-sm text-gray-600">www.dogivo.co.il</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <p className="text-sm text-gray-600">תל אביב, ישראל</p>
            </div>
          </div>
        </Card>

        {/* Version */}
        <p className="text-center text-xs text-gray-300">גרסה 1.0.0 · © 2026 Dogivo</p>

      </div>
    </div>
  )
}
