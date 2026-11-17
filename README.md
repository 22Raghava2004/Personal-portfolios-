# Personal-portfolios-

A two-mode personal portfolio with a React/Vite frontend and Django REST Framework backend.

## Features

- Creative and Developer modes share one continuous scrolling page.
- Creative projects support one uploaded image **or** one uploaded video.
- Developer projects require one image.
- Skills, posts and About content are managed in Django Admin; the public site has no seeded/sample records.
- Day/night city backgrounds are selectable in Developer Mode.
- PostgreSQL is configured through `DATABASE_URL`; local development falls back to SQLite.

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations content
python manage.py migrate --run-syncdb
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (separate terminal)

```bash
npm install
npm run dev
```

Configure the Vite dev proxy in `vite.config.js` if you use a separate frontend/backend development origin, or serve the built frontend through Django using Docker.

Open `/admin/` to add Projects, Skills, Posts, About entries and Site Profile settings. Public JSON endpoints are under `/api/`.

## Deployment

The root `Dockerfile` builds the Vite app and runs Django/Gunicorn on `0.0.0.0:8000`. Set `DATABASE_URL`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD` as deployment environment variables. Do not commit secrets.

**Media persistence:** the default Django media storage is local container storage. Before production, configure durable object storage (for example Cloudinary or an S3-compatible bucket) so uploaded portfolio assets survive rebuilds and redeploys. Back up PostgreSQL separately.

## Content API

- `GET /api/projects/?mode=creative|developer`
- `GET /api/skills/?mode=creative|developer`
- `GET /api/posts/?mode=creative|developer`
- `GET /api/about/?mode=creative|developer`
- `GET /api/site/`
- `GET /api/health/`
