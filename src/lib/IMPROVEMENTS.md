# API Improvements Guide

## What's Better in `api-improved.ts`?

### 1. **Custom Error Handling**
- `ApiError` class with status codes and detailed error data
- Distinguishes between network errors, timeouts, and server errors
- Better debugging information

### 2. **Request Timeout**
- All requests have configurable timeouts (default: 10s for regular, 15s for predictions)
- Prevents hanging requests
- Uses AbortController for clean cancellation

### 3. **Response Caching**
- Stats, cluster info, and examples are cached for 30 seconds
- Reduces unnecessary API calls
- Can force refresh with `skipCache: true`

### 4. **Better TypeScript**
- Strongly typed errors
- Optional configuration parameters
- Type-safe throughout

### 5. **Class-Based API**
- Singleton pattern
- Shared cache across all components
- Can add middleware/interceptors easily

## How to Use It

### Basic Usage (same as before)

```typescript
import { api } from '@/lib/api-improved';

// Same API, just works better!
const stats = await api.getStats();
```

### With Error Handling

```typescript
import { api, ApiError } from '@/lib/api-improved';

try {
  const result = await api.predictMultiModel(message);
  console.log('Success:', result);
} catch (error) {
  if (error instanceof ApiError) {
    // Now you can handle specific errors
    if (error.status === 503) {
      console.error('Model not loaded:', error.message);
    } else if (error.status === 408) {
      console.error('Request timed out');
    } else if (error.status === 0) {
      console.error('Network error:', error.message);
    } else {
      console.error(`Error ${error.status}:`, error.message);
    }
  }
}
```

### With Custom Timeout

```typescript
// For slow predictions, increase timeout
const result = await api.predictMultiModel(message, {
  timeout: 30000 // 30 seconds
});
```

### Force Refresh Cache

```typescript
// Skip cache to get fresh data
const stats = await api.getStats(true);
const clusterInfo = await api.getClusterInfo(true);
```

### Clear Cache Manually

```typescript
api.clearCache(); // Clear all cached data
```

## Example: Using in React Component

```typescript
import { useState } from 'react';
import { api, ApiError } from '@/lib/api-improved';

function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.predictMultiModel(message);
      console.log('Prediction:', result);
    } catch (err) {
      if (err instanceof ApiError) {
        // User-friendly error messages
        if (err.status === 503) {
          setError('The AI model is not available. Please try again later.');
        } else if (err.status === 408) {
          setError('Request timed out. Please check your connection.');
        } else if (err.status === 0) {
          setError('Network error. Please check if the backend is running.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* Your component */}
    </div>
  );
}
```

## Migration Steps

To switch from `api.ts` to `api-improved.ts`:

1. Rename files:
   ```bash
   mv src/lib/api.ts src/lib/api-old.ts
   mv src/lib/api-improved.ts src/lib/api.ts
   ```

2. Update your components to handle errors better (optional but recommended)

3. Test everything still works!

## Future Improvements (Optional)

### Option A: Add React Query (Recommended for Production)

Install:
```bash
npm install @tanstack/react-query
```

Benefits:
- Automatic caching and background refetching
- Loading/error states built-in
- Automatic retries
- Much less boilerplate

### Option B: Add Request Retry Logic

```typescript
// In api-improved.ts, add retry function
async function fetchWithRetry(url: string, options: RequestConfig, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Option C: Add Request Queue

Useful if you need to prevent too many simultaneous requests.

### Option D: Add WebSocket Support

For real-time stats updates without polling.

## Summary

The improved API provides:
- ✅ Better error handling and debugging
- ✅ Request timeouts (no more hanging)
- ✅ Response caching (better performance)
- ✅ Type safety throughout
- ✅ Easy to extend with more features
- ✅ Same simple API, just works better!
