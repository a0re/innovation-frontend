# Spam Detection Frontend

Modern, responsive web interface for the Spam Detection API built with React, TypeScript, and Tailwind CSS. Features real-time analytics, interactive testing, and comprehensive visualizations.

## ✨ Features

- **📊 Interactive Dashboard**: Real-time analytics with charts and statistics
- **🧪 Model Testing Interface**: Test single or batch messages
- **📈 Multi-Model Comparison**: Compare predictions across all three ML models
- **🎨 Cluster Visualization**: Insights into spam subtypes with top terms
- **🌓 Dark/Light Mode**: Built-in theme switcher
- **📱 Fully Responsive**: Works seamlessly on all devices
- **⚡ Type-Safe**: Complete TypeScript implementation
- **🎯 Production-Ready**: Optimized builds with Vite

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm, yarn, or pnpm

### Installation

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

## 📦 Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
innovation-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ... (30+ components)
│   │   ├── Navigation.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-mobile.ts
│   ├── lib/                # Utilities and API
│   │   ├── api.ts         # API service layer
│   │   ├── utils.ts       # Helper functions
│   │   └── monthlySpamAggregation.ts
│   ├── pages/              # Route pages
│   │   ├── Dashboard.tsx
│   │   └── ModelTest.tsx
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env.example            # Environment template
├── index.html              # HTML entry
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
└── tailwind.config.js      # Tailwind config
```

## 🎨 Pages & Routes

### Home Page (`/`)
Landing page with:
- Feature overview
- Getting started guide
- Component showcase
- Navigation to Dashboard and Model Test

### Dashboard (`/dashboard`)
Comprehensive analytics view:
- **Statistics Cards**:
  - Total predictions count
  - Spam detected count
  - Average confidence score
  - Detection rate visualization
- **Cluster Analysis**:
  - Total clusters with silhouette score
  - Cluster distribution with top terms
  - Visual spam subtype identification
- **Monthly Trends**:
  - Line chart showing spam type trends over time
  - Historical data visualization
- **Example Messages**:
  - Sample spam and legitimate messages
  - Quick reference for users

### Model Test (`/model-test`)
Interactive testing interface:
- **Model Configuration**:
  - Toggle individual models on/off
  - Multinomial Naive Bayes
  - Logistic Regression
  - Linear SVC
- **Single Message Test**:
  - Test one message at a time
  - View predictions from all models
  - See ensemble voting results
  - Cluster information for spam
- **Batch Message Test**:
  - Test up to 100 messages simultaneously
  - Bulk analysis with statistics
  - Individual predictions for each message

## 🔌 API Integration

All API communication is handled through a centralized service in `src/lib/api.ts`.

### Type-Safe API Calls

```typescript
import { api } from '@/lib/api';

// Health check
const health = await api.health();

// Get statistics
const stats = await api.getStats();

// Single prediction
const result = await api.predictMultiModel("Test message");

// Batch prediction
const batchResult = await api.predictBatchMultiModel([
  "Message 1",
  "Message 2"
]);

// Get cluster information
const clusterInfo = await api.getClusterInfo();

// Get examples
const examples = await api.getExamples();
```

### TypeScript Types

All API responses are fully typed:

```typescript
type MultiModelPrediction = {
  message: string;
  processed_message: string;
  multinomial_nb: PredictionResult;
  logistic_regression: PredictionResult;
  linear_svc: PredictionResult;
  ensemble: EnsemblePrediction;
  cluster: ClusterInfo | null;
  timestamp: string;
}
```

## 🎨 Styling & Theming

### Tailwind CSS

Custom design system with:
- CSS variables for theming
- Dark/light mode support
- Responsive breakpoints
- Custom color palette

### shadcn/ui Components

Using [shadcn/ui](https://ui.shadcn.com/) for UI components.

**Add new components:**
```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
```

### Theme Switching

Built-in dark/light mode toggle using `next-themes`:
- Automatic system preference detection
- Manual theme switching
- Persistent theme selection

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com
```

**Note**: All environment variables must be prefixed with `VITE_` to be exposed to the client.

### Import Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Dashboard } from '@/pages/Dashboard'
```

## 🚀 Production Build

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory with:
- Minified JavaScript and CSS
- Code splitting
- Tree shaking
- Asset optimization

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## 📤 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect GitHub repository
2. Set environment variable: `VITE_API_URL`
3. Deploy

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variable: `VITE_API_URL`

### Other Platforms

The `dist/` folder can be deployed to:
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**
- **Cloudflare Pages**

Simply upload the contents of `dist/` to your static hosting service.

### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t spam-detection-frontend .
docker run -p 80:80 spam-detection-frontend
```

## 🛠️ Development

### Hot Module Replacement

Vite provides instant HMR - changes are reflected immediately without full page reloads.

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

Watch mode:
```bash
npm run type-check -- --watch
```

### Linting

```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint -- --fix
```

## ❌ Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Caught and displayed with user-friendly messages
- **API Failures**: Show retry buttons and error details
- **Loading States**: Skeleton loaders for all async operations
- **Empty States**: Helpful messages when no data is available
- **Type Safety**: TypeScript prevents many runtime errors

Example error handling:
```typescript
try {
  const data = await api.predictMultiModel(message);
  setResult(data);
  setError(null);
} catch (err) {
  const errorMessage = err instanceof Error
    ? err.message
    : "Prediction failed";
  setError(errorMessage);
}
```

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: "Failed to fetch" errors

**Solutions**:
1. Ensure backend is running on `http://localhost:8000`
2. Check `VITE_API_URL` in `.env` matches backend URL
3. Verify CORS settings in backend `.env`:
   ```env
   CORS_ORIGINS=http://localhost:5174,http://localhost:5173
   ```

### Build Errors

**Problem**: Build fails or errors during `npm run build`

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Type Errors

**Problem**: TypeScript errors in IDE

**Solutions**:
```bash
# Run type check
npm run type-check

# Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔗 Related Projects

- **Backend API**: ../innovation-backend
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vite.dev/

## 📝 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
