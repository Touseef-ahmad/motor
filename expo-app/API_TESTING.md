# API Integration Test

This document describes how to test the API integration.

## Testing the API Connection

### 1. Health Check

Test the API health endpoint:

```bash
curl https://motor-api-ogln.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Motor API is running"
}
```

### 2. Test Car Creation

Create a new car:

```bash
curl -X POST https://motor-api-ogln.onrender.com/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Test Car",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "color": "Blue",
    "licensePlate": "ABC123",
    "currentMileage": 50000,
    "images": [],
    "emoji": "🚗",
    "backgroundStyle": "gradient",
    "backgroundColor": "#007AFF",
    "secondaryColor": "#00D4FF"
  }'
```

### 3. Get All Cars

```bash
curl https://motor-api-ogln.onrender.com/api/cars
```

### 4. Mobile App Testing

The mobile app will automatically:
1. Attempt to load data from the API on startup
2. Fall back to AsyncStorage if the API is unreachable
3. Sync all create/update/delete operations with the API
4. Cache data locally for offline access

## Fallback Behavior

If the API is unavailable (network error, service down, etc.):
- Data loads from AsyncStorage cache
- Create/update/delete operations are saved to AsyncStorage
- The app continues to function normally in offline mode
- Once API is available again, operations can be manually synced

## Configuration

Current configuration (`expo-app/src/config/api.ts`):
- `USE_BACKEND = true` - Backend integration enabled
- `API_URL = 'https://motor-api-ogln.onrender.com/api'` - Production API endpoint

To disable backend:
- Set `USE_BACKEND = false`
- App will use AsyncStorage only (offline-first mode)
