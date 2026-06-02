import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email: string, password: string, name: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      phone: '',
      city: '',
      createdAt: serverTimestamp(),
    })
    await setDoc(doc(db, 'users', user.uid, 'dogs', 'primary'), {
      name: '',
      breed: 'גולדן רטריבר',
      age: '1',
      size: 'בינוני',
      gender: 'זכר',
      notes: '',
    })
  }

  async function loginWithGoogle() {
    const { user } = await signInWithPopup(auth, googleProvider)
    const userRef = doc(db, 'users', user.uid)
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName ?? '',
        email: user.email ?? '',
        phone: '',
        city: '',
        createdAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'users', user.uid, 'dogs', 'primary'), {
        name: '',
        breed: 'גולדן רטריבר',
        age: '1',
        size: 'בינוני',
        gender: 'זכר',
        notes: '',
      })
    }
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
