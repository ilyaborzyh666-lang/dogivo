import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Input } from '../components/ui'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('ישראל ישראלי')
  const [email, setEmail] = useState('israel@example.com')
  const [phone, setPhone] = useState('050-1234567')
  const [city, setCity] = useState('תל אביב')

  return (
    <div className="min-h-screen bg-orange-50 pb-10">
      <div className="bg-white border-b border-orange-100 px-5 py-5 flex items-center gap-3">
        <button onClick={() => navigate('/profile')} className="text-gray-500 font-semibold text-sm">←</button>
        <h1 className="font-display font-black text-xl text-gray-900">עריכת פרופיל</h1>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar name={name} size="xl" />
          <button className="text-brand-500 text-sm font-semibold">שנה תמונה</button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input label="שם מלא" value={name} onChange={e => setName(e.target.value)} />
          <Input label="אימייל" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="טלפון" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input label="עיר" value={city} onChange={e => setCity(e.target.value)} />
        </div>

        <Button fullWidth size="lg" onClick={() => navigate('/profile')}>
          שמור שינויים
        </Button>

      </div>
    </div>
  )
}
