import { useEffect, useState } from 'react'
import { BottomNav } from './BookingsPage'
import { WalkerBottomNav } from './WalkerDashboardPage'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function MessagesPage() {
  const { backendToken } = useAuth()
  const [isWalker, setIsWalker] = useState(false)

  useEffect(() => {
    if (!backendToken) return
    api.getMyWalkerProfile().then(p => setIsWalker(!!p)).catch(() => {})
  }, [backendToken])

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white border-b border-orange-100 px-5 py-5">
        <h1 className="font-display font-black text-2xl text-gray-900">הודעות</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-5xl mb-3">💬</p>
        <p className="font-semibold text-gray-500">אין הודעות עדיין</p>
        <p className="text-sm mt-1">הודעות יופיעו כאן לאחר הזמנה</p>
      </div>

      {isWalker ? <WalkerBottomNav active="messages" /> : <BottomNav active="messages" />}
    </div>
  )
}
