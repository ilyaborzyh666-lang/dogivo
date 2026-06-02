import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8BjF6ov4BNQ0eG7bVT3cxTESTOOFpRlI",
  authDomain: "dogivo-cacc9.firebaseapp.com",
  projectId: "dogivo-cacc9",
  storageBucket: "dogivo-cacc9.firebasestorage.app",
  messagingSenderId: "416092695466",
  appId: "1:416092695466:web:195a14f0d22f52294359d3",
  measurementId: "G-NS5ZNEWF70"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
