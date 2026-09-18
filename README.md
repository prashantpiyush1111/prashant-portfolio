# Prashant Maurya — Developer Portfolio

Premium full-stack portfolio built with React, Tailwind CSS, Framer Motion and Spring Boot + MySQL.

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8+

## MySQL
Create the database (the application can also create it automatically):

```sql
CREATE DATABASE portfolio_db;
```

Optional environment variables:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`


## Environment variables

### Backend / deployment
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `ALLOWED_ORIGIN`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_TO`
- `BREVO_SMTP_HOST` (optional)
- `BREVO_SMTP_PORT` (optional, defaults to 587)
- `BREVO_SMTP_USERNAME` (optional)
- `BREVO_SMTP_PASSWORD` (optional)
- `BREVO_FROM_EMAIL` (optional)
- `ADMIN_API_KEY`
- `SPRING_PROFILES_ACTIVE` (optional)

Brevo settings are optional at startup. If they are not configured, visitor confirmation email is skipped; the contact message can still be saved and the Gmail admin notification can still work when Gmail settings are configured.

### Frontend
- `VITE_API_BASE_URL`
- `VITE_SITE_URL`

## Backend
```bash
cd backend
mvn spring-boot:run
```
Backend: `http://localhost:8080`

APIs: `GET /api/projects`, `GET /api/projects/{id}`, `GET /api/skills`, `GET /api/blogs`, `GET /api/blogs/{id}`, `GET /api/achievements`, `POST /api/contact`

Health check: `GET /actuator/health` (only the health actuator endpoint is exposed).

### Production profile
Set `SPRING_PROFILES_ACTIVE=prod` in the deployment environment. The production profile uses `spring.jpa.hibernate.ddl-auto=validate` so Hibernate will validate the existing schema instead of changing it automatically. Apply database schema changes through your deployment/database migration process before enabling the profile.

## Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend: `http://localhost:5173`

Set `VITE_API_BASE_URL` in `.env` when the backend is hosted elsewhere.

## Resume
The Download Resume button expects `frontend/public/resume.pdf`. Replace that placeholder file with your final PDF using the exact same filename before deployment.

## Project screenshots
Drop real project screenshots in `frontend/public/projects/` using the filenames referenced by the fallback project data:
- `ai-sales-forecasting.png`
- `rag-educational-assistant.png`
- `task-management-system.png`

The frontend uses relative `/projects/...` paths, so replacing those image files does not require code changes.
