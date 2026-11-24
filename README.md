# Personal Portfolio

React/Vite frontend with Django REST Framework backend.

## Repository layout

- `backend/templates/src/` — React application and styles
- `backend/templates/public/videos/` — day/night background videos
- `backend/templates/dist/` — generated frontend build served by Django
- `backend/config/` — Django project settings and URL/WSGI configuration
- `backend/content/` — Django content app and migrations
- `Dockerfile` — multi-stage frontend build and Django/Gunicorn runtime

## Local development

Backend:

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

For the live-reloading frontend, use a second terminal:

```bash
cd backend/templates
npm install
npm run dev
```

Open the Vite URL it prints (usually `http://localhost:5173`). If you want Django at `http://127.0.0.1:8000/` to serve the built page instead, run `npm run build` from `backend/templates` first.

## Deployment

Build and run the root Dockerfile. Configure `DATABASE_URL`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and optional Django superuser environment variables on the hosting platform. Do not commit secrets.

Django local media storage is not persistent across container rebuilds. Configure durable object storage before relying on production uploads.
