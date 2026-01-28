#!/bin/bash

API_KEY="AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU"

echo "Testing Gemini API with gemini-pro..."
echo "======================================"

curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello in one word"
      }]
    }]
  }' | python3 -m json.tool

echo ""
echo "======================================"
echo ""
echo "Testing with gemini-1.5-flash..."
echo "======================================"

curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello in one word"
      }]
    }]
  }' | python3 -m json.tool

echo ""
echo "======================================"
echo "Tests complete"
