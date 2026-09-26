# Writing Vault

An isolated writing application added to the portfolio repository without changing the existing portfolio application.

## Structure

- `writing-backend/` — standalone Spring Boot API on port 9899
- `writing-frontend/` — standalone React/Vite app on port 5174
- Existing `frontend/` and `backend/` are intentionally untouched.

## Access model

- Owner login uses `WRITING_OWNER_USERNAME` and `WRITING_OWNER_PASSWORD`.
- Public readers use the configured 4-digit `WRITING_PUBLIC_CODE`.
- Owner receives an owner-scoped access token.
- Public readers receive a public-scoped access token.
- Private CRUD endpoints require the owner token.
- Public writing reads require a public or owner token.

## Local setup

Create a MySQL database named `writing_vault`, then set:

```text
WRITING_DB_URL
WRITING_DB_USERNAME
WRITING_DB_PASSWORD
WRITING_OWNER_USERNAME
WRITING_OWNER_PASSWORD
WRITING_PUBLIC_CODE
WRITING_CORS_ORIGIN
```

Run backend:

```bash
cd writing-backend
mvn spring-boot:run
```

Run frontend:

```bash
cd writing-frontend
npm install
npm run dev
```

The existing portfolio remains independent of this application.

## Production checklist

1. Use strong, unique owner credentials; never keep sample defaults.
2. Set a non-default 4-digit public code and keep it out of source control.
3. Configure WRITING_CORS_ORIGIN to the exact deployed frontend origin.
4. Use HTTPS for both deployed frontend and backend.
5. Configure production MySQL credentials through hosting-provider secrets/environment settings.
6. The requested 4-digit access model includes rate limiting; for sensitive content, a longer secret or authenticated sharing link is preferable.
7. Tokens expire after 12 hours and are stored in backend memory, so a backend restart invalidates active sessions.

## Deployment layout

Deploy `writing-backend/` as a separate Spring Boot service and `writing-frontend/` as a separate Vite site. Set the frontend `VITE_WRITING_API` to the deployed backend `/api` URL.

Do not connect this application to the existing portfolio deployment unless that integration is explicitly requested. The two applications are intentionally isolated.
