# 🔍 HOW TO CHECK WHY IT'S OFFLINE

## Step 1: Wait for Vercel Deployment
1. The new code (commit `e34f166`) is deploying now
2. Wait ~2-3 minutes for deployment to complete
3. Check Vercel dashboard - status should be "Ready" ✅

## Step 2: Open Browser Console
1. Go to: https://cultural-compass.vercel.app
2. Press **F12** (or Cmd+Option+I on Mac)
3. Click the **Console** tab
4. **Hard refresh** the page: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Step 3: Look for Debug Output

You should see a log that looks like this:

```
🔍 Environment Debug: {
  import.meta.env.VITE_GEMINI_API_KEY: "MISSING" or "SET",
  import.meta.env.API_KEY: "MISSING" or "SET",
  All env keys: ["BASE_URL", "MODE", "DEV", "PROD", ...],
  Mode: "production",
  Prod: true
}
```

### What to Look For:

#### ✅ GOOD (API Key Found):
```
🔍 Environment Debug: {
  import.meta.env.API_KEY: "SET",
  ...
}
Initializing Gemini with Key: AIza...VjJU
```

#### ❌ BAD (API Key Missing):
```
🔍 Environment Debug: {
  import.meta.env.VITE_GEMINI_API_KEY: "MISSING",
  import.meta.env.API_KEY: "MISSING",
  All env keys: ["BASE_URL", "MODE", "DEV", "PROD"],
  ...
}
Initializing Gemini with Key: MISSING
⚠️ API Key missing - using fallback data
```

## Step 4: Diagnose the Issue

### If "All env keys" shows ONLY ["BASE_URL", "MODE", "DEV", "PROD"]
**Problem:** Vite is NOT injecting the API_KEY during build

**Solution:** The issue is in how Vercel passes environment variables to Vite

**Fix:**
1. In Vercel, the environment variable might need to be prefixed
2. Try adding BOTH in Vercel:
   - `API_KEY` = `AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU`
   - `VITE_API_KEY` = `AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU`

### If "All env keys" shows your API_KEY
**Problem:** The key is there but something else is wrong

**Solution:** Check the next log line to see what value it has

## Step 5: Screenshot and Share

Take a screenshot of the console output showing:
1. The "🔍 Environment Debug" log
2. The "Initializing Gemini with Key" log
3. Any warning messages

Share this with me so I can see exactly what's happening!

## Common Issues and Fixes

### Issue 1: Vercel Not Passing Environment Variables
**Symptom:** "All env keys" doesn't include API_KEY

**Fix:**
1. Vercel → Settings → Environment Variables
2. Make sure `API_KEY` is set for **Production** environment
3. After saving, go to Deployments → Click latest → Redeploy

### Issue 2: Vite Not Injecting Variables
**Symptom:** API_KEY in Vercel but not in browser console

**Fix:** Try prefixing with `VITE_`:
- In Vercel, add: `VITE_API_KEY` = `AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU`
- Redeploy

### Issue 3: API Key Quota Exhausted
**Symptom:** API_KEY shows in console but still offline

**Fix:** Check the next log line:
- If it says "429" → Quota exhausted, wait or get new key
- If it says "403" → Invalid key

## Quick Test Checklist

After deployment completes:

- [ ] Hard refresh the page (Cmd+Shift+R)
- [ ] Open browser console (F12)
- [ ] Look for "🔍 Environment Debug" log
- [ ] Check if API_KEY is "SET" or "MISSING"
- [ ] Check "All env keys" array
- [ ] Screenshot the console
- [ ] Share screenshot with me

## What I Need From You

To help you fix this, I need to see:

1. **Screenshot of browser console** showing the debug logs
2. **Screenshot of Vercel environment variables page** (you can blur the actual key value)
3. **Confirmation that** the latest deployment (commit `e34f166`) is live

With this information, I can tell you exactly what's wrong and how to fix it!

---

**Next Steps:**
1. Wait for Vercel deployment to finish (~2 min)
2. Open the site and check browser console
3. Share screenshot of the debug output
4. I'll tell you exactly what to fix!
