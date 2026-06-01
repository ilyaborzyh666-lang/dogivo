import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui'

export default function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col items-center justify-between px-6 py-12">

      {/* Top */}
      <div className="w-full flex justify-center pt-8">
        <Logo size="lg" />
      </div>

      {/* Center illustration + text */}
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">
        <div className="text-8xl select-none">🐕</div>
        <div className="space-y-3">
          <h1 className="font-display font-black text-4xl text-gray-900 leading-tight">
            טיולים לכלבים<br />שאפשר לסמוך עליהם
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            מצאו מטיילים מהימנים בקרבתכם, עקבו בזמן אמת ותהיו רגועים.
          </p>
        </div>
      </div>

      {/* Role selection */}
      <div className="w-full max-w-sm space-y-3">
        <p className="text-center text-sm font-semibold text-gray-400 mb-4">אני רוצה...</p>

        <button
          onClick={() => navigate('/login?role=owner')}
          className="w-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-lg rounded-3xl py-4 px-6 flex items-center justify-between shadow-lg shadow-orange-200 transition-all duration-150"
        >
          <span className="text-3xl">🐾</span>
          <span>למצוא מטייל לכלב שלי</span>
          <span className="text-xl opacity-60">›</span>
        </button>

        <button
          onClick={() => navigate('/login?role=walker')}
          className="w-full bg-white hover:bg-orange-50 active:scale-95 text-gray-900 font-bold text-lg rounded-3xl py-4 px-6 flex items-center justify-between border border-orange-200 shadow-sm transition-all duration-150"
        >
          <span className="text-3xl">🦮</span>
          <span>להיות מטייל כלבים</span>
          <span className="text-xl opacity-40">›</span>
        </button>

        <p className="text-center text-xs text-gray-400 pt-2">
          כבר יש לך חשבון?{' '}
          <button onClick={() => navigate('/login')} className="text-brand-500 font-semibold underline-offset-2 hover:underline">
            התחבר
          </button>
        </p>
      </div>

    </div>
  )
}
