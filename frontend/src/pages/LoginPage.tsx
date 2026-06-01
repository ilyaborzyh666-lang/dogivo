import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Logo, Button, Input } from '../components/ui'

export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get('role')

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo + back */}
        <div className="flex flex-col items-center gap-2">
          <Logo size="md" />
          {role && (
            <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full">
              {role === 'owner' ? '🐾 בעל כלב' : '🦮 מטייל כלבים'}
            </span>
          )}
        </div>

        {/* Toggle */}
        <div className="bg-white rounded-2xl p-1 flex border border-orange-100 shadow-sm">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            התחברות
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            הרשמה
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 space-y-4">
          {mode === 'register' && (
            <Input
              label="שם מלא"
              placeholder="ישראל ישראלי"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <Input
            label="אימייל"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            label="סיסמה"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            hint={mode === 'register' ? 'לפחות 8 תווים' : undefined}
          />

          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/home')}
            className="mt-2"
          >
            {mode === 'login' ? 'התחבר' : 'צור חשבון'}
          </Button>
        </div>

        {/* Google */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-orange-200" />
            <span className="text-xs text-gray-400 font-medium">או</span>
            <div className="flex-1 h-px bg-orange-200" />
          </div>
          <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 flex items-center justify-center gap-3 font-semibold text-sm text-gray-700 shadow-sm transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            המשך עם Google
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← חזור
        </button>

      </div>
    </div>
  )
}
