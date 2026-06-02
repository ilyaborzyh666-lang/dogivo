import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'

interface Dog {
  name: string
  breed: string
  age: string
  size: string
  gender: string
  notes: string
  photo?: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  city: string
  photo?: string
}

interface AppState {
  user: UserProfile
  dog: Dog
  setUser: (u: UserProfile) => void
  setDog: (d: Dog) => void
  saveUser: (u: UserProfile) => Promise<void>
  saveDog: (d: Dog) => Promise<void>
}

const defaultUser: UserProfile = { name: '', email: '', phone: '', city: '' }
const defaultDog: Dog = { name: '', breed: '', age: '', size: '', gender: '', notes: '' }

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [dog, setDog] = useState<Dog>(defaultDog)

  useEffect(() => {
    if (!currentUser) {
      setUser(defaultUser)
      setDog(defaultDog)
      return
    }
    const uid = currentUser.uid
    getDoc(doc(db, 'users', uid)).then(snap => {
      if (snap.exists()) setUser(snap.data() as UserProfile)
    })
    const dogRef = doc(db, 'users', uid, 'dogs', 'primary')
    getDoc(dogRef).then(snap => {
      if (snap.exists()) {
        setDog(snap.data() as Dog)
      } else {
        const initial = { name: '', breed: 'גולדן רטריבר', age: '1', size: 'בינוני', gender: 'זכר', notes: '' }
        setDoc(dogRef, initial)
        setDog(initial)
      }
    })
  }, [currentUser])

  function stripUndefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
  }

  async function saveUser(u: UserProfile) {
    setUser(u)
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid), stripUndefined(u), { merge: true })
    }
  }

  async function saveDog(d: Dog) {
    setDog(d)
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid, 'dogs', 'primary'), stripUndefined(d))
    }
  }

  return (
    <AppContext.Provider value={{ user, dog, setUser, setDog, saveUser, saveDog }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
