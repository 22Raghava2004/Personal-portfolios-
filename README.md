# Personal Portfolio

React/Vite frontend with Django REST Framework backend.

## Repository layout

- `frontend/src/` — React application and styles
- `frontend/public/videos/` — day/night background videos
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
pip install -r requirements.txt
python manage.py migrate --run-syncdb
python manage.py createsuperuser
python manage.py runserver
```

Frontend (from repository root, separate terminal):

```bash
cd frontend
npm install
npm run dev
```

## Deployment

Build and run the root Dockerfile. Configure `DATABASE_URL`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and optional Django superuser environment variables on the hosting platform. Do not commit secrets.

Django local media storage is not persistent across container rebuilds. Configure durable object storage before relying on production uploads.
