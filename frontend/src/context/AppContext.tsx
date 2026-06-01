import { createContext, useContext, useState, ReactNode } from 'react'

interface Dog {
  name: string
  breed: string
  age: string
  size: string
  gender: string
  notes: string
  photo?: string
}

interface User {
  name: string
  email: string
  phone: string
  city: string
  photo?: string
}

interface AppState {
  user: User
  dog: Dog
  setUser: (u: User) => void
  setDog: (d: Dog) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: 'ישראל ישראלי',
    email: 'israel@example.com',
    phone: '050-1234567',
    city: 'תל אביב',
  })

  const [dog, setDog] = useState<Dog>({
    name: 'מקס',
    breed: 'גולדן רטריבר',
    age: '3',
    size: 'גדול',
    gender: 'זכר',
    notes: '',
  })

  return (
    <AppContext.Provider value={{ user, dog, setUser, setDog }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
