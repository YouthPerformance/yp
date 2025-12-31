# Peterson Academy Clone

A fully functional clone of petersonacademy.com - an online education platform offering world-class courses from distinguished professors.

## Features

- **Course Library**: Browse 75+ courses across 7 disciplines (Psychology, Philosophy, Science, History, etc.)
- **Video Lectures**: Custom video player with progress tracking, playback speed, and picture-in-picture
- **User Authentication**: JWT-based auth with sign up, sign in, and password reset
- **Subscription System**: $399/year subscription with mock Stripe checkout
- **Progress Tracking**: Track lecture completion, course progress, and learning streaks
- **User Dashboard**: Continue watching, enrolled courses, and recommendations
- **Instructor Profiles**: Full professor bios with credentials and course listings
- **Mobile Responsive**: Optimized for all device sizes with touch-friendly controls

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS (via CDN)
- React Router for navigation
- Framer Motion for animations
- Custom HTML5 video player

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- JWT authentication with bcrypt
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
2. Run the setup script:
   ```bash
   ./init.sh
   ```

3. Start the development servers:

   **Terminal 1 (Frontend):**
   ```bash
   pnpm dev
   ```

   **Terminal 2 (Backend):**
   ```bash
   cd server && pnpm dev
   ```

4. Seed the database (first time only):
   ```bash
   cd server && pnpm seed
   ```

### Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Project Structure

```
peterson-academy-project/
├── public/
│   ├── images/          # Course thumbnails, instructor photos
│   └── videos/          # Video lecture files
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   └── utils/           # Utility functions
├── server/
│   ├── db/              # SQLite database
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── index.js         # Server entry point
│   └── seed.js          # Database seeding script
└── init.sh              # Setup script
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/lectures` - Get course lectures
- `GET /api/courses/featured` - Get featured courses

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/lecture/:id` - Update lecture progress

### Subscriptions
- `GET /api/subscription` - Get subscription status
- `POST /api/subscription/checkout` - Start checkout

## Design System

### Colors
- Primary: Amber/Gold (#D4A853)
- Background: Near black (#0A0A0A)
- Surface: Dark gray (#1A1A1A)
- Text: Off-white (#E5E5E5)

### Typography
- Headings: Playfair Display (serif)
- Body: Inter, system-ui (sans-serif)

## License

This is a learning project and clone for educational purposes only.
