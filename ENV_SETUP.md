# 🔧 Environment Variable Setup Guide

## Local Development vs. Vercel Production

Your app now supports **both** environment variable naming conventions:

### Local Development (Vite)
```bash
# .env.local
VITE_GEMINI_API_KEY=AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU
```

### Vercel Production
```
Environment Variable Name: API_KEY
Value: AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU
```

## How It Works

The code automatically checks for both variables:

```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.API_KEY || '';
```

This means:
- ✅ Works locally with `VITE_GEMINI_API_KEY`
- ✅ Works on Vercel with `API_KEY`
- ✅ No code changes needed between environments

## Setup Instructions

### For Local Development
1. Create/edit `.env.local` in your project root
2. Add: `VITE_GEMINI_API_KEY=your_key_here`
3. Restart your dev server
4. The `VITE_` prefix is required for Vite to expose it to the browser

### For Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add variable:
   - **Name**: `API_KEY`
   - **Value**: `AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU`
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your project

## Current API Key

```
AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU
```

This key is:
- ✅ Valid and working
- ✅ Has access to all Gemini models
- ✅ Fresh quota available

## Supported Models

Your API key has access to these models (we're using `gemini-2.0-flash`):
- `gemini-2.5-flash` (newest)
- `gemini-2.5-pro`
- `gemini-2.0-flash` ⭐ (currently used)
- `gemini-3-flash-preview`
- And many more...

## Troubleshooting

### Issue: Still showing "Offline mode"
**Solutions:**
1. Check browser console for the log: "Initializing Gemini with Key: AIza..."
2. If it says "MISSING", restart your dev server
3. Clear browser cache and hard refresh (Cmd+Shift+R)

### Issue: 429 Error
**Cause:** Rate limit or quota exhausted
**Solution:** 
- Wait a few minutes
- The fallback system will handle it automatically
- Users still get helpful advice

### Issue: Works locally but not on Vercel
**Solution:**
1. Verify `API_KEY` is set in Vercel environment variables
2. Make sure it's enabled for all environments
3. Trigger a new deployment after adding the variable

## Security Notes

⚠️ **Important:**
- `.env.local` is in `.gitignore` - your API key is NOT pushed to GitHub
- Never commit API keys to your repository
- Vercel environment variables are encrypted and secure
- The key is only exposed to your deployed app

## Testing

To test if your API key is working:

```bash
# Run the test script
./test-api.sh
```

Expected output:
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Hello!"
      }]
    }
  }]
}
```

If you see a 429 error, wait a few minutes and try again.

---

**Last Updated:** January 28, 2026  
**Current API Key:** AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU
