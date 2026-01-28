# 🔄 Fallback Mechanism Documentation

## Overview
The Cultural Compass now includes a **robust fallback system** that ensures the app remains functional even when the Gemini API is unavailable, rate-limited, or experiencing issues.

## How It Works

### Automatic Fallback Triggers
The app automatically switches to fallback mode when:

1. **API Key Missing** - No `VITE_GEMINI_API_KEY` in `.env.local`
2. **Rate Limit Exceeded (429)** - Too many requests in a short time
3. **Quota Exhausted (403)** - API quota has been used up
4. **Server Errors (5xx)** - Google's servers are down
5. **Network Timeout** - Request takes longer than 15 seconds
6. **Parse Errors** - API returns invalid JSON
7. **Empty Response** - API returns no content
8. **Client-Side Rate Limiting** - More than 10 requests per minute

### Fallback Data Features

The fallback system provides **scenario-aware guidance** based on the user's question:

#### Supported Scenarios:
- **Greetings** - Formal/informal greeting etiquette
- **Dining** - Table manners and tipping customs
- **Dress Code** - Gender-specific clothing guidance
- **Gift-Giving** - Cultural gift protocols
- **Business Meetings** - Professional etiquette
- **General Behavior** - Default cultural advice

Each scenario includes:
- ✅ 3 actionable steps
- ✅ Critical "Red Flag" warning
- ✅ Generic phrase guidance
- ✅ Contextual advice based on origin/destination

### User Experience

#### Visual Indicators:
When fallback mode is active, users see:
```
⚡ Offline mode - showing general guidance
```

This amber notification appears above the results, letting users know they're viewing general advice rather than AI-generated content.

#### Console Logging:
Developers can monitor fallback triggers via console warnings:
- `🔄 Using fallback mechanism - API unavailable`
- `⚠️ API Rate limit exceeded (429) - using fallback`
- `⚠️ API Key invalid or quota exceeded (403) - using fallback`
- `⚠️ Server error - using fallback`
- `⚠️ Request timeout - using fallback`
- `⚠️ Network error - using fallback`
- `⚠️ Client-side rate limit reached - using fallback`

## Configuration

### Environment Variables
```bash
# .env.local
VITE_GEMINI_API_KEY=your_api_key_here
```

**Note:** The `VITE_` prefix is required for Vite to expose the variable to the client-side code.

### Rate Limiting
Client-side rate limiting is configured in `geminiService.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;
```

Adjust these values to match your API tier limits.

### Timeout Settings
Request timeout is set to 15 seconds:

```typescript
const timeoutId = setTimeout(() => controller.abort(), 15000);
```

## Benefits

### 1. **Always Available**
The app never crashes or shows blank screens - users always get helpful guidance.

### 2. **Cost Control**
Client-side rate limiting prevents excessive API usage and unexpected bills.

### 3. **Better UX**
Users receive immediate feedback instead of error messages or loading states.

### 4. **Graceful Degradation**
The app smoothly transitions between live API and fallback data without disruption.

### 5. **Development Friendly**
Developers can work without API keys during development.

## Testing the Fallback

### Test Scenarios:

1. **Missing API Key**
   ```bash
   # Remove or comment out in .env.local
   # VITE_GEMINI_API_KEY=...
   ```

2. **Invalid API Key**
   ```bash
   VITE_GEMINI_API_KEY=invalid_key_123
   ```

3. **Rapid Requests**
   - Click multiple question buttons quickly
   - Should trigger client-side rate limiting after 10 requests

4. **Network Simulation**
   - Use browser DevTools to throttle network
   - Set to "Offline" mode to test timeout handling

## Troubleshooting

### Issue: Fallback always active
**Solution:** Check that `VITE_GEMINI_API_KEY` is set correctly in `.env.local` and restart your dev server.

### Issue: API works but fallback shows
**Solution:** Check console for specific error messages. May indicate quota or rate limit issues.

### Issue: No fallback notification
**Solution:** Ensure you're using the latest version of `App.tsx` with fallback detection.

## Future Enhancements

Potential improvements:
- [ ] Cache successful API responses for offline use
- [ ] Add retry logic with exponential backoff
- [ ] Store user preferences for fallback behavior
- [ ] Implement more detailed scenario-specific fallback data
- [ ] Add analytics to track fallback usage rates

## Technical Details

### Error Handling Flow
```
API Request → Error Detected → Check Error Type → Return Fallback Data
                    ↓
            Log Warning to Console
                    ↓
            Set Fallback Mode Flag
                    ↓
            Display User Notification
```

### Code Structure
- **Service Layer**: `services/geminiService.ts` - Handles API calls and fallback logic
- **UI Layer**: `App.tsx` - Detects and displays fallback mode
- **Type Safety**: `vite-env.d.ts` - TypeScript definitions for environment variables

---

**Last Updated:** January 28, 2026  
**Version:** 1.3 (with Fallback System)
