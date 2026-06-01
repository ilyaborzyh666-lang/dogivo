import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PhotoPicker } from '../components/ui'
import { useApp } from '../context/AppContext'

const BREEDS = ['גולדן רטריבר', 'לברדור', 'פודל', 'בולדוג', 'הסקי', 'שיצו', 'מאלטז', 'ביגל', 'רועה גרמני', 'אחר']
const SIZES = [
  { label: 'קטן', sub: 'עד 10 ק״ג', icon: '🐩' },
  { label: 'בינוני', sub: '10–25 ק״ג', icon: '🐕' },
  { label: 'גדול', sub: 'מעל 25 ק״ג', icon: '🦮' },
]

export default function EditDogPage() {
  const navigate = useNavigate()
  const { dog, setDog } = useApp()

  const [name, setName] = useState(dog.name)
  const [breed, setBreed] = useState(dog.breed)
  const [age, setAge] = useState(dog.age)
  const [size, setSize] = useState(dog.size)
  const [gender, setGender] = useState(dog.gender)
  const [notes, setNotes] = useState(dog.notes)
  const [photo, setPhoto] = useState(dog.photo)

  function save() {
    setDog({ name, breed, age, size, gender, notes, photo })
    navigate('/my-dogs')
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-10">
      <div className="bg-white border-b border-orange-100 px-5 py-5 flex items-center gap-3">
        <button onClick={() => navigate('/my-dogs')} className="text-gray-500 font-semibold text-sm">←</button>
        <h1 className="font-display font-black text-xl text-gray-900">עריכת פרטי הכלב</h1>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
        <PhotoPicker
          photo={photo}
          fallback="🐕"
          shape="rounded"
          onChange={setPhoto}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="שם הכלב" value={name} onChange={e => setName(e.target.value)} />
          <Input label="גיל (שנים)" type="number" value={age} min="0" max="10" onChange={e => { const v = Math.min(10, Math.max(0, Number(e.target.value))); setAge(String(v)) }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">גזע</label>
          <select
            value={breed}
            onChange={e => setBreed(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {BREEDS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">גודל</p>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map(s => (
              <button
                key={s.label}
                onClick={() => setSize(s.label)}
                className={`rounded-2xl py-3 flex flex-col items-center gap-1 border transition-all ${
                  size === s.label
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-bold">{s.label}</span>
                <span className={`text-xs ${size === s.label ? 'opacity-75' : 'text-gray-400'}`}>{s.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">מין</p>
          <div className="grid grid-cols-2 gap-2">
            {['זכר', 'נקבה'].map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`rounded-2xl py-3 text-sm font-bold border transition-all ${
                  gender === g
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                }`}
              >
                {g === 'זכר' ? '♂ זכר' : '♀ נקבה'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">הערות למטיילים (אופציונלי)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="למשל: לא מסתדר עם חתולים, צריך ריצה..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          />
        </div>

        <Button fullWidth size="lg" onClick={save}>שמור שינויים</Button>
      </div>
    </div>
  )
}
