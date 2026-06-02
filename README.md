<div align="center">

# 🐾 Dogivo

### הפלטפורמה המובילה בישראל לחיבור בין בעלי כלבים למטיילים מקצועיים

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)](#)

**[Screenshots](#screenshots) · [Features](#features) · [Architecture](#architecture) · [Quick Start](#quick-start) · [API Reference](#api-reference)**

</div>

---

## The Problem

Finding a trustworthy dog walker is stressful. You're handing someone a family member. And once the walk starts — you have no idea what's happening.

**Dogivo fixes that.**

Find a verified walker nearby, book in seconds, and watch the live route on your phone while your dog is out. Every walker is rated by real dog owners in your area.

---

## Screenshots

<div align="center">

| Onboarding | Login | Register |
|:----------:|:-----:|:--------:|
| <img src="screen/Снимок экрана 2026-06-02 115900.png" width="180"/> | <img src="screen/Снимок экрана 2026-06-02 115929.png" width="180"/> | <img src="screen/Снимок экрана 2026-06-02 115940.png" width="180"/> |

| Home | Bookings | Messages | Profile |
|:----:|:--------:|:--------:|:-------:|
| <img src="screen/Снимок экрана 2026-06-02 120054.png" width="180"/> | <img src="screen/Снимок экрана 2026-06-02 120058.png" width="180"/> | <img src="screen/Снимок экрана 2026-06-02 120103.png" width="180"/> | <img src="screen/Снимок экрана 2026-06-02 120107.png" width="180"/> |

</div>

---

## Features

### 🔍 Discovery
- **Location-based search** — find walkers within your neighbourhood
- **Real-time availability** — פנוי / עסוק status updated live
- **Ratings & reviews** — verified reviews from real dog owners
- **Walker profiles** — bio, experience, service area, pricing

### 📅 Booking
- **Instant booking** — pick a date, time, and duration; confirm in two taps
- **Booking history** — full list of upcoming and past walks with status badges
- **Cancellation flow** — cancel upcoming bookings with one tap

### 📍 Live Tracking
- **Real-time GPS map** — watch the route as it happens via WebSocket
- **Walk duration & distance** — live counters updated every few seconds
- **Walk complete notification** — get notified the moment the walker marks the walk done

### 💬 Messaging
- **Direct chat** — message any walker before or after a booking
- **Unread badge** — notification dot on the nav tab when new messages arrive

### 👤 Profile & Settings
- **Photo upload** — profile photo for owner, per-dog photo, chat avatars
- **My dogs** — add multiple dogs with breed, age, and photo
- **Payment methods** — saved card management
- **Notifications, Privacy, Help** — full settings suite
- **About page** — app mission, stats, and contact

### 🔐 Auth
- **Email + password** registration and login
- **Google OAuth2** one-tap sign-in
- **JWT tokens** — secure, stateless sessions
- **Firebase Auth** — industry-standard identity management

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│               React 19 + TypeScript (Vite)              │
│                                                         │
│  OnboardingPage  LoginPage  HomePage  WalkerProfile     │
│  BookingPage  TrackingPage  BookingsPage  MessagesPage  │
│  ProfilePage  EditProfilePage  EditDogPage  AboutPage   │
│                                                         │
│  Context: AuthContext · AppContext                       │
│  UI Kit:  Avatar · Badge · Button · Card · Input · Logo │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend                         │
│                                                         │
│  /auth     /users     /walkers                          │
│  /bookings /payments                                    │
│                                                         │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Services   │  │  Core    │  │   WebSocket      │  │
│  │ user_service │  │ jwt      │  │ live tracking    │  │
│  │ walk_service │  │ bcrypt   │  │ real-time chat   │  │
│  │ book_service │  │ oauth2   │  │                  │  │
│  │ pay_service  │  │ stripe   │  │                  │  │
│  └──────────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                PostgreSQL + Redis                        │
│  users · walkers · bookings · payments · reviews        │
└─────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│               Firebase                                   │
│  Auth (email + Google) · Firestore · Hosting            │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · TypeScript · Vite · Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Backend | Python · FastAPI · SQLAlchemy |
| Auth | Firebase Auth · JWT · Google OAuth2 |
| Database | PostgreSQL · Redis |
| Real-time | WebSocket (live tracking + chat) |
| Payments | Stripe |
| Storage | Firebase Storage (photo uploads) |
| Hosting | Firebase Hosting |
| DevOps | Docker · docker-compose |

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| Python | 3.11+ |
| PostgreSQL | Any |
| Docker | Optional |

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 2. Backend

```bash
cd backend
pip install -r requirements.txt

cp .env.example .env   # fill in your credentials

uvicorn app.main:app --reload --port 8000
```

> API docs: **http://localhost:8000/docs**

### 3. Docker (both services)

```bash
docker-compose up
```

### 4. Environment Variables

```env
# backend/.env

DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/dogivo
SECRET_KEY=your-256-bit-secret
ALGORITHM=HS256

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
REDIS_URL=redis://localhost:6379
```

---

## API Reference

<details>
<summary>View all endpoints</summary>

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/auth/register` | — | Register with email + password |
| `POST` | `/auth/login` | — | Login, receive JWT |
| `POST` | `/auth/google` | — | Google OAuth2 sign-in |
| `GET` | `/users/me` | ✓ | Current user profile |
| `PUT` | `/users/me` | ✓ | Update profile + photo |
| `GET` | `/walkers` | ✓ | List walkers with filters |
| `GET` | `/walkers/{id}` | ✓ | Walker profile + reviews |
| `POST` | `/bookings` | ✓ | Create a booking |
| `GET` | `/bookings` | ✓ | List user bookings |
| `PUT` | `/bookings/{id}` | ✓ | Update / cancel booking |
| `POST` | `/payments` | ✓ | Process payment via Stripe |
| `WS` | `/ws/tracking/{id}` | ✓ | Live walk GPS stream |
| `WS` | `/ws/chat/{id}` | ✓ | Real-time messaging |

</details>

---

## Project Structure

<details>
<summary>View full structure</summary>

```
Dogivo/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── OnboardingPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── HomePage.tsx
│       │   ├── WalkerProfilePage.tsx
│       │   ├── BookingPage.tsx
│       │   ├── TrackingPage.tsx
│       │   ├── BookingsPage.tsx
│       │   ├── MessagesPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── EditProfilePage.tsx
│       │   ├── EditDogPage.tsx
│       │   ├── AboutPage.tsx
│       │   └── SimpleSettingsPage.tsx
│       ├── components/ui/
│       │   ├── Avatar.tsx
│       │   ├── Badge.tsx
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Input.tsx
│       │   ├── Logo.tsx
│       │   └── PhotoPicker.tsx
│       ├── context/
│       │   ├── AuthContext.tsx
│       │   └── AppContext.tsx
│       └── App.tsx
├── backend/
│   └── app/
│       ├── api/          ← auth · users · walkers · bookings · payments
│       ├── models/       ← user · walker · booking · payment · review
│       ├── schemas/      ← Pydantic validation
│       ├── services/     ← business logic
│       ├── core/         ← jwt · security · oauth2
│       ├── websocket/    ← live tracking + chat
│       └── main.py
├── screen/               ← App screenshots
├── docker-compose.yml
└── firebase.json
```

</details>

---

## Roadmap

### v1.1 — Go Live
- [ ] Deploy backend to Railway / Render
- [ ] Production Firebase Hosting deployment
- [ ] Real walker onboarding flow

### v1.2 — Walker Side
- [ ] Walker dashboard (manage availability, view bookings)
- [ ] Walker earnings & payout via Stripe Connect
- [ ] GPS route recording during walk

### v1.3 — Growth
- [ ] Push notifications (walk reminders, new messages)
- [ ] In-app review prompt after completed walk
- [ ] Referral system

---

## License

MIT © 2026

---

<div align="center">

Built with FastAPI · PostgreSQL · React · Firebase · ❤️

</div>
