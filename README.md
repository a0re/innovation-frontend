# Spam Detection Frontend

Modern web interface for the Spam Detection API built with React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm, yarn, or pnpm

## Setup

1. **Navigate to frontend directory:**
   ```bash
   cd innovation-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   App available at `http://localhost:5174`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

**Note**: All environment variables must be prefixed with `VITE_`.
