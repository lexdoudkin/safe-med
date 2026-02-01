# SafeMed

Personalized medicine safety analysis powered by AI. Check if medications are safe for your unique body and health conditions.

## Structure

```
safe-med/
├── frontend/    # React + Vite app
└── backend/     # API (coming soon)
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:3000

### Environment

Create `frontend/.env`:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Deploy to Cloud Run

```bash
cd frontend
gcloud run deploy safemed-frontend \
  --source . \
  --build-arg VITE_GEMINI_API_KEY=your_key \
  --allow-unauthenticated
```

## Backend

Coming soon.
