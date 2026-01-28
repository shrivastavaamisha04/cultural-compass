#!/bin/bash

API_KEY="AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU"

echo "Testing Gemini API..."
echo "===================="

curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello"
      }]
    }]
  }' | python3 -m json.tool

echo ""
echo "===================="
echo "Test complete"
