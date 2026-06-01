import { useState } from 'react'
import { Avatar, Card } from '../components/ui'
import { BottomNav } from './BookingsPage'
import { useApp } from '../context/AppContext'

const conversations = [
  { id: 1, name: 'יונתן כהן', emoji: '👨', last: 'מחר אני מגיע ב-8:00 בדיוק!', time: '09:14', unread: 2 },
  { id: 2, name: 'מיכל לוי', emoji: '👩', last: 'מקס היה מדהים היום 🐾', time: 'אתמול', unread: 0 },
  { id: 3, name: 'אורי גולדברג', emoji: '🧑', last: 'אוכל לשנות את השעה?', time: 'ראשון', unread: 1 },
]

const demoMessages = [
  { from: 'walker', text: 'שלום! אני יונתן, אשמח לטייל עם הכלב שלך 🐕', time: '09:00' },
  { from: 'me', text: 'היי! מגניב, מתי אתה פנוי?', time: '09:05' },
  { from: 'walker', text: 'מחר בבוקר ב-8:00 אני פנוי', time: '09:10' },
  { from: 'walker', text: 'מחר אני מגיע ב-8:00 בדיוק!', time: '09:14' },
]

export default function MessagesPage() {
  const [open, setOpen] = useState<number | null>(null)
  const [input, setInput] = useState('')
  const { user } = useApp()

  const conv = conversations.find(c => c.id === open)

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      {open === null ? (
        <>
          <div className="bg-white border-b border-orange-100 px-5 py-5">
            <h1 className="font-display font-black text-2xl text-gray-900">הודעות</h1>
          </div>
          <div className="px-5 py-5 space-y-2 max-w-lg mx-auto">
            {conversations.map(c => (
              <Card
                key={c.id}
                className="flex items-center gap-3 cursor-pointer hover:shadow-md active:scale-95 transition-all"
                onClick={() => setOpen(c.id)}
              >
                <div className="relative">
                  <span className="text-4xl">{c.emoji}</span>
                  {c.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.last}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{c.time}</span>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-screen">
          {/* Chat header */}
          <div className="bg-white border-b border-orange-100 px-5 py-4 flex items-center gap-3">
            <button onClick={() => setOpen(null)} className="text-gray-500 font-semibold text-sm">←</button>
            <span className="text-3xl">{conv?.emoji}</span>
            <div>
              <p className="font-bold text-sm text-gray-900">{conv?.name}</p>
              <p className="text-xs text-green-500 font-medium">מחובר</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-32">
            {demoMessages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.from === 'me' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar
                  src={m.from === 'me' ? user.photo : undefined}
                  name={m.from === 'me' ? user.name : conv?.name}
                  size="sm"
                />
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                  m.from === 'me'
                    ? 'bg-white border border-orange-100 text-gray-800'
                    : 'bg-brand-500 text-white'
                }`}>
                  <p>{m.text}</p>
                  <p className={`text-xs mt-1 ${m.from === 'me' ? 'text-gray-400' : 'opacity-70'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-4 py-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="כתוב הודעה..."
              className="flex-1 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              onClick={() => setInput('')}
              className="bg-brand-500 text-white rounded-2xl px-4 py-2.5 font-bold text-sm hover:bg-brand-600 transition-colors"
            >
              שלח
            </button>
          </div>
        </div>
      )}

      {open === null && <BottomNav active="messages" />}
    </div>
  )
}
