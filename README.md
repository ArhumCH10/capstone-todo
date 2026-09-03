# DevOps Capstone — To-Do App

This is the one app the whole 8-lecture course builds on top of. It's deliberately tiny: a Node.js + Express backend serving a to-do list API, with a plain HTML/JS frontend — no framework, no build step, nothing that distracts from the DevOps tooling being taught.

## Running it locally

### With Docker Compose

This is the recommended way to run the current database-backed version:

```
docker compose up -d --build
```

Then open http://localhost:3000. After changing `server.js`, files in `public/`,
`Dockerfile`, or `docker-compose.yml`, run the same command again so Docker
rebuilds the image and recreates the app container.

Useful commands:

```
docker compose ps
docker compose logs -f app
docker compose down
```

`docker compose down` stops and removes the containers. The named database
volume is kept, so todos remain when the stack is started again. To remove the
database data as well, use `docker compose down -v`.

### With Node directly

Use this only when PostgreSQL is already running locally and the `DB_HOST`,
`DB_USER`, `DB_PASSWORD`, and `DB_NAME` environment variables point to it:

```
npm install
npm start
```

Then open http://localhost:3000.

## When this shows up in the course

You do **not** need to hand this out before Lecture 3 — Lectures 1 and 2 don't touch it. From Lecture 3 onward:

- **Lecture 3:** students write a `Dockerfile` for this app and run it in a container.
- **Lecture 4:** todos move from the in-memory array in `server.js` into a real database container, wired up with Docker Compose.
- **Lecture 5:** a GitHub Actions workflow builds, tests, and pushes this app's image automatically.
- **Lecture 6:** it gets deployed to an AWS EC2 instance.
- **Lecture 7:** that EC2 instance + its security group get rebuilt as Terraform code.
- **Lecture 8:** it's deployed to a local Kubernetes cluster with a monitoring dashboard attached.

The `/health` endpoint already in `server.js` isn't used until Lecture 6+ (load balancer / container health checks) — it's there now so you don't have to touch the app code again later.
