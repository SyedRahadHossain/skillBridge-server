# SkillBridge Server

The REST API for SkillBridge — a tutoring platform where students can find and book expert tutors.

Built with Express.js, TypeScript, Prisma, and Better Auth.

---

## Tech Stack

- **Framework** — Express.js 5
- **Language** — TypeScript
- **ORM** — Prisma 5
- **Database** — PostgreSQL
- **Auth** — Better Auth 1.2
- **Package Manager** — pnpm

---

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL running locally

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/skillbridge-server.git
cd skillbridge-server
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillbridge-server
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**4. Run database migrations**

```bash
npx prisma migrate dev
```

**5. Seed the database**

```bash
psql -U postgres -d skillbridge-server -h 127.0.0.1 -f seed.sql
```

**6. Start the development server**

```bash
pnpm dev
```

Server runs on [http://localhost:5000](http://localhost:5000)

---

## Project Structure

```
src/
├── modules/              # Feature modules
│   ├── user/             # User profile
│   ├── tutor/            # Tutor profiles and availability
│   ├── booking/          # Session bookings
│   ├── review/           # Reviews and ratings
│   ├── category/         # Subject categories
│   └── admin/            # Admin management
├── middlewares/          # Auth guard middleware
├── helpers/              # Pagination and sorting helpers
├── lib/                  # Prisma client and Better Auth setup
├── routes/               # Main API router
├── scripts/              # Seed and utility scripts
├── app.ts                # Express app setup
└── server.ts             # Server entry point
```

---

## API Endpoints

### Auth (Better Auth)

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | `/api/auth/sign-up/email` | Register new user   |
| POST   | `/api/auth/sign-in/email` | Login               |
| POST   | `/api/auth/sign-out`      | Logout              |
| GET    | `/api/auth/get-session`   | Get current session |

### Users

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/api/users/me` | Get current user profile |

### Tutors

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/api/tutors`            | List all tutors with filters |
| GET    | `/api/tutors/:id`        | Get tutor by ID              |
| GET    | `/api/tutors/profile/me` | Get my tutor profile         |
| PUT    | `/api/tutors/profile/me` | Update my tutor profile      |

### Bookings

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/bookings`            | Create a booking      |
| GET    | `/api/bookings`            | Get my bookings       |
| GET    | `/api/bookings/:id`        | Get booking by ID     |
| PATCH  | `/api/bookings/:id/status` | Update booking status |

### Reviews

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | `/api/reviews`                       | Submit a review         |
| GET    | `/api/reviews/tutor/:tutorProfileId` | Get reviews for a tutor |

### Categories

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/categories`     | List all categories     |
| POST   | `/api/categories`     | Create category (admin) |
| PUT    | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Admin

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/api/admin/stats`     | Platform statistics        |
| GET    | `/api/admin/users`     | List all users             |
| PATCH  | `/api/admin/users/:id` | Update user role or status |
| GET    | `/api/admin/bookings`  | List all bookings          |

---

## Features

- Role-based access control (student, tutor, admin)
- Session-based authentication with Better Auth
- Tutor search with subject, price, and rating filters
- Booking lifecycle management (confirmed, completed, cancelled)
- Review system with automatic rating updates
- Admin controls for users, bookings, and categories
- Pagination and sorting on all list endpoints

---

## Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Compile TypeScript
pnpm start        # Start production server
npx prisma studio # Open Prisma database GUI
```
