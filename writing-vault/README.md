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