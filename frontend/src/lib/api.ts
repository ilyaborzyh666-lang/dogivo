const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

let _backendToken: string | null = null

export function setBackendToken(token: string | null) {
  _backendToken = token
}

export function getBackendToken() {
  return _backendToken
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (_backendToken) {
    headers['Authorization'] = `Bearer ${_backendToken}`
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  // Auth
  exchangeFirebaseToken: (idToken: string) =>
    request<{ access_token: string; refresh_token: string }>('/auth/firebase', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    }),

  // Walkers
  searchWalkers: (params?: { lat?: number; lon?: number; city?: string; max_price?: number }) => {
    const q = new URLSearchParams()
    if (params?.lat) q.set('lat', String(params.lat))
    if (params?.lon) q.set('lon', String(params.lon))
    if (params?.city) q.set('city', params.city)
    if (params?.max_price) q.set('max_price', String(params.max_price))
    return request<WalkerResult[]>(`/walkers/search?${q}`)
  },

  getWalker: (userId: number) =>
    request<WalkerProfile>(`/walkers/${userId}`),

  // Bookings
  getBookings: () =>
    request<Booking[]>('/bookings/'),

  createBooking: (data: CreateBookingData) =>
    request<Booking>('/bookings/', { method: 'POST', body: JSON.stringify(data) }),

  updateBookingStatus: (bookingId: number, status: string) =>
    request<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  leaveReview: (bookingId: number, rating: number, comment: string) =>
    request(`/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }),

  // Walker
  getMyWalkerProfile: () =>
    request<WalkerProfile>('/walkers/me'),

  updateWalkerProfile: (data: Partial<{ bio: string; price_per_hour: number; city: string; is_available: boolean; years_experience: number }>) =>
    request<WalkerProfile>('/walkers/me', { method: 'PATCH', body: JSON.stringify(data) }),

  createWalkerProfile: (data: Partial<{ bio: string; price_per_hour: number; city: string; is_available: boolean; years_experience: number }>) =>
    request<WalkerProfile>('/walkers/me', { method: 'POST', body: JSON.stringify(data) }),

  getWalkerBookings: () =>
    request<Booking[]>('/bookings/?as_walker=true'),
}

// Types
export interface WalkerResult {
  id: number
  user_id: number
  full_name: string
  avatar_url: string | null
  bio: string | null
  price_per_hour: number
  city: string | null
  rating: number
  total_reviews: number
  is_available: boolean
  distance_km: number | null
}

export interface WalkerProfile extends WalkerResult {
  years_experience: number
  user: { id: number; full_name: string; email: string; avatar_url: string | null }
}

export interface Booking {
  id: number
  owner_id: number
  walker_id: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  scheduled_start: string
  scheduled_end: string
  actual_start: string | null
  actual_end: string | null
  dog_name: string
  dog_breed: string | null
  notes: string | null
  total_price: number
  created_at: string
}

export interface CreateBookingData {
  walker_id: number
  scheduled_start: string
  scheduled_end: string
  dog_name: string
  dog_breed?: string
  notes?: string
}
