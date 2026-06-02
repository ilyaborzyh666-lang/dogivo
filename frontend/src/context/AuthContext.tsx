import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
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
import { api, setBackendToken } from '../lib/api'

interface AuthContextType {
  currentUser: User | null
  backendToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

async function exchangeToken(user: User): Promise<string | null> {
  try {
    const idToken = await user.getIdToken()
    const res = await api.exchangeFirebaseToken(idToken)
    setBackendToken(res.access_token)
    return res.access_token
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [backendToken, setBackendTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user)
      if (user) {
        const token = await exchangeToken(user)
        setBackendTokenState(token)
      } else {
        setBackendToken(null)
        setBackendTokenState(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const token = await exchangeToken(user)
    setBackendTokenState(token)
  }

  async function register(email: string, password: string, name: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    await setDoc(doc(db, 'users', user.uid), {
      name, email, phone: '', city: '',
      createdAt: serverTimestamp(),
    })
    await setDoc(doc(db, 'users', user.uid, 'dogs', 'primary'), {
      name: '', breed: 'גולדן רטריבר', age: '1', size: 'בינוני', gender: 'זכר', notes: '',
    })
    const token = await exchangeToken(user)
    setBackendTokenState(token)
  }

  async function loginWithGoogle() {
    const { user } = await signInWithPopup(auth, googleProvider)
    const userRef = doc(db, 'users', user.uid)
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName ?? '', email: user.email ?? '',
        phone: '', city: '', createdAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'users', user.uid, 'dogs', 'primary'), {
        name: '', breed: 'גולדן רטריבר', age: '1', size: 'בינוני', gender: 'זכר', notes: '',
      })
    }
    const token = await exchangeToken(user)
    setBackendTokenState(token)
  }

  async function logout() {
    await signOut(auth)
    setBackendToken(null)
    setBackendTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, backendToken, loading, login, register, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
