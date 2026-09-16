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

## Backend
```bash
cd backend
mvn spring-boot:run
```
Backend: `http://localhost:8080`

APIs: `GET /api/projects`, `GET /api/projects/{id}`, `GET /api/skills`, `GET /api/blogs`, `GET /api/blogs/{id}`, `POST /api/contact`

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
The Download Resume button expects `frontend/public/resume.pdf`. Add the final PDF before deployment.
