# Deployment

## Local

```bash
cp .env.example .env
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Docker

```bash
docker compose up --build
```

## Environment Variables

See `.env.example` for all supported providers and server settings.

## Notes

- Default port is `3000`.
- Set `HOST=0.0.0.0` when exposing the port publicly.
- Do not commit real API keys.
