# CarMarket

A full-stack vehicle listing platform. Visitors browse, filter and sort listings; registered users
post their own ads and manage them. Built with FastAPI and Angular, containerised, and deployed to
AWS EC2 through GitHub Actions.

It started as my BSc thesis project and has since been rebuilt — authentication, migrations,
search and pagination, the frontend design, and the CI/CD pipeline.

Live demo → http://16.16.55.190/listings

Sign in with the seeded demo account: **`demo_user`** / **`demo123`** to see the owner-only controls. Editing and deleting
are hidden — and rejected by the API — on listings you don't own, so the demo account owns about
half the seeded listings.

![Browse listings](docs/screenshots/browse.png)

---

## Screenshots

| Listing detail                                 | Creating a listing                             |
| ---------------------------------------------- | ---------------------------------------------- |
| ![Listing detail](docs/screenshots/detail.png) | ![Create listing](docs/screenshots/create.png) |

Validation runs on both server and client side, and the messages quote the bound that was violated. The maximum model year is computed at runtime as `CURRENT_YEAR + 1`.

![Form validation](docs/screenshots/validation.png)

## Features

### Authentication and authorization

- User registration and login
- JWT-based authentication
- Access token refresh
- Password hashing with bcrypt
- Protected API endpoints
- Ownership-based authorization for listing updates and deletion

### Vehicle listings

- Create, read, update, and delete listings
- Server-side filtering by brand, fuel type, year range and price range
- Server-side sorting by brand, year, price, mileage and creation date
- Pagination with configurable page sizes
- Validation of listing and user input with Pydantic

### Frontend

- Angular single-page application, standalone components, zoneless change detection
- Reactive forms with per-field validation messages mirroring the backend bounds
- Authentication guards and an HTTP interceptor
- Listing browsing, detail and management pages
- Plain CSS built on custom-property design tokens

### Backend and infrastructure

- REST API built with FastAPI
- PostgreSQL database, SQLAlchemy ORM
- Alembic database migrations, applied automatically on container start
- Structured JSON logging
- Automated backend and frontend tests
- Docker-based development and deployment
- Multi-stage Angular Docker build
- Nginx for static frontend hosting and reverse proxying
- GitHub Actions CI/CD, Docker Hub image publishing, AWS EC2 deployment

## Tech Stack

### Backend

Python 3.12 - FastAPI - Pydantic - SQLAlchemy - Alembic - Pytest - PostgreSQL 16 - JWT - bcrypt

### Frontend

Angular 21 - TypeScript - RxJS - Vitest - CSS

### DevOps

Docker - Docker Compose - Nginx - Git - GitHub Actions - Docker Hub - AWS EC2 - Linux

## Architecture

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         │  Angular Frontend   │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / REST
                                    ▼
                         ┌─────────────────────┐
                         │        Nginx        │
                         │ Static files / proxy│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FastAPI        │
                         │       Backend       │
                         └──────────┬──────────┘
                                    │
                                    │ SQLAlchemy
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         └─────────────────────┘
```

In the production environment the frontend and backend are containerized separately. Nginx serves
the Angular production build and proxies `/api/` requests to the FastAPI container.

## API

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /auth/me
```

### Listings

```text
GET    /listings
GET    /listings/{listing_id}
POST   /listings
PUT    /listings/{listing_id}
DELETE /listings/{listing_id}
```

The listings endpoint supports pagination, filtering and sorting through query parameters:

```text
GET /listings?page=1&page_size=24&brand=Toyota&year_min=2018&price_max=10000000&sort_by=price&order=asc
```

There is also a health-check endpoint, which the container orchestration depends on — the backend
only reports healthy once migrations have completed:

```text
GET /health
```

## Running it with Docker

The quickest path. Requires Docker and Docker Compose.

```bash
git clone https://github.com/SuszterD/carmarket.git
cd carmarket
docker compose up --build
```

That brings up PostgreSQL, the backend and the frontend, applies all migrations, and seeds the
database with 100 sample listings and the demo users.

| Service    | URL                        |
| ---------- | -------------------------- |
| Frontend   | http://localhost:4200      |
| API        | http://localhost:8000      |
| API docs   | http://localhost:8000/docs |
| PostgreSQL | localhost:5432             |

Startup is ordered by health checks: the backend waits until PostgreSQL accepts connections, and
seeding waits until the backend reports healthy. Since Uvicorn only starts after
`alembic upgrade head` returns, a healthy backend also means migrations are complete.

Seeding is idempotent and skips when data already exists. To force a reseed:

```bash
docker compose run --rm seed --wipe
```

## Local development without Docker

### Prerequisites

Python 3.12, Node.js 20+, npm, Git, and a PostgreSQL 16 instance. The database can be started on
its own with `docker compose -f docker-compose.db.yml up -d`.

### Backend

```bash
cd backend
python3.12 -m venv .venv          # Windows: py -3.12 -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env.dev`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carmarket
SECRET_KEY=<random-hex-string>
```

Generate a key with `python3 -c "import secrets; print(secrets.token_hex(32))"` (`python` instead
of `python3` on Windows).

Then apply migrations, seed, and start the API:

```bash
alembic upgrade head
python -m scripts.seed_db
uvicorn app.main:app --reload
```

### Frontend

In another terminal:

```bash
cd frontend/carmarket
npm ci
npm start
```

The dev server runs on http://localhost:4200.

## Testing

117 tests — 58 backend, 59 frontend.

```bash
# Backend: auth, ownership, validation bounds, listings, health checks
cd backend && pytest

# Frontend: component logic, form validation, routing
cd frontend/carmarket && npm test
```

The GitHub Actions pipeline runs both suites on pushes to `main` and on pull requests.

## CI/CD

```text
Pull Request / Push
        │
        ▼
┌───────────────────┐
│ Frontend tests    │
│ Backend tests     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Build Docker      │
│ images            │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Push to Docker Hub│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Deploy to AWS EC2 │
│ via SSH           │
└───────────────────┘
```

On pushes to `main` the pipeline runs both test suites, builds the backend and frontend images,
tags them with `latest` and the commit SHA, pushes them to Docker Hub, then connects to the EC2
instance over SSH, pulls the new images and restarts the services.

## Database Migrations

Alembic is the single source of truth for the schema — there is no `create_all()` anywhere, and
the backend container runs `alembic upgrade head` before starting Uvicorn.

```bash
alembic revision --autogenerate -m "describe change"   # create
alembic upgrade head                                   # apply
alembic downgrade -1                                   # roll back
```

The project includes migrations for the initial schema, the users table, listing ownership,
indexes on the filtered columns, and required timestamps.

Alembic reads the same `DATABASE_URL` the application does — `alembic/env.py` overrides the
`sqlalchemy.url` placeholder at runtime.

## Project Structure

```text
carmarket/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── alembic/
│   │   └── versions/
│   ├── app/
│   │   ├── core/           # config, security, logging
│   │   ├── middleware/
│   │   ├── routers/        # auth, listings
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── scripts/
│   │   └── seed_db.py
│   ├── tests/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── requirements.txt
├── frontend/
│   └── carmarket/
│       ├── src/app/
│       │   ├── core/       # auth service, guard, interceptor
│       │   └── features/   # auth, listings
│       ├── Dockerfile
│       └── nginx.conf
├── docs/
│   └── screenshots/
├── docker-compose.yml
└── docker-compose.db.yml
```
