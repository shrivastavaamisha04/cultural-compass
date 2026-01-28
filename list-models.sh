#!/bin/bash

API_KEY="AIzaSyDfnND4XE5OBCr30RRg2zq_hnUKqh5VjJU"

echo "Listing available Gemini models..."
echo "===================================="

curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}" | python3 -m json.tool | grep -A 2 "name"

echo ""
echo "===================================="
