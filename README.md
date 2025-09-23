# TrackFlow

A modern bug tracking application built with TypeScript, Express, and React.

## Tech Stack

- **Backend:** Express.js with TypeScript
- **Frontend:** React with Vite and TypeScript
- **Database:** Postgres with Prisma

## Development Setup

1. **Install all dependencies:**

   ```bash
   npm run install:all
   ```

2. **Run both client and server:**

   ```bash
   npm run dev
   ```

3. **Or run individually:**
   - Server: `npm run server:dev` (http://localhost:8000)
   - Client: `npm run client:dev` (http://localhost:5173)

## Project Structure

```
trackflow/
├── server/     # Express.js API
├── client/     # React frontend
└── README.md
```

## API Endpoints

- Health Check: `GET /api/health`

## Getting Started

1. Clone the repository
2. Follow the Development Setup steps above
3. Visit http://localhost:5173 to access the application
4. API will be available at http://localhost:8000
