import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PhotoPicker } from '../components/ui'
import { useApp } from '../context/AppContext'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useApp()

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [city, setCity] = useState(user.city)
  const [photo, setPhoto] = useState(user.photo)

  function save() {
    setUser({ name, email, phone, city, photo })
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-10">
      <div className="bg-white border-b border-orange-100 px-5 py-5 flex items-center gap-3">
        <button onClick={() => navigate('/profile')} className="text-gray-500 font-semibold text-sm">←</button>
        <h1 className="font-display font-black text-xl text-gray-900">עריכת פרופיל</h1>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        <PhotoPicker
          photo={photo}
          fallback={name.slice(0, 2).toUpperCase()}
          onChange={setPhoto}
        />

        <div className="space-y-4">
          <Input label="שם מלא" value={name} onChange={e => setName(e.target.value)} />
          <Input label="אימייל" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="טלפון" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input label="עיר" value={city} onChange={e => setCity(e.target.value)} />
        </div>

        <Button fullWidth size="lg" onClick={save}>שמור שינויים</Button>
      </div>
    </div>
  )
}
