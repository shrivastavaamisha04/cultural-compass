# API Key Troubleshooting Guide

## Current Issue
The error "gemini-pro is not found for API version v1" suggests your API key may not be properly configured for the Generative Language API.

## IMMEDIATE FIX - Test Your API Key

Open your terminal and run this command (replace YOUR_API_KEY with your actual key):

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBPyZhTa9RmpcF7Tpk9eNn_fF2IyAL0OgM"
```

### Expected Results:

**If it works:** You'll see a JSON response listing available models.

**If it fails:** You'll see an error like:
- "API key not valid" - The key is wrong or expired
- "API has not been used in project" - You need to enable the API
- "Permission denied" - The key doesn't have the right permissions

## How to Get a NEW Working API Key

1. **Go to Google AI Studio**: https://aistudio.google.com/app/apikey
2. **Create API Key** (or use existing)
3. **IMPORTANT**: Make sure you're creating a key for "Generative Language API" (not just "Google Cloud")
4. **Copy the key** - it should start with `AIza`
5. **Update in Vercel**:
   - Go to your Vercel project settings
   - Environment Variables
   - Edit `API_KEY` 
   - Paste the new key
   - Click Save
   - **Redeploy** your project

## Alternative: Use a Different Model Endpoint

If the API key is correct but models aren't available, we can try the newest endpoint that's most likely to work.
