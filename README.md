# GBG
FiveM gang website — React + Vite frontend, Spring Boot REST API backend.

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| **Java** | 17 |
| **Maven** | 3.8+ (or use the `./mvnw` wrapper) |
| **Node.js** | 18+ |
| **npm** | 9+ (bundled with Node 18) |

---

## Running locally

Both the backend and frontend must be running at the same time. Open **two terminal windows**.

### 1 — Start the backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```

> On first run Maven will download all dependencies automatically.

The API starts on **http://localhost:8080**.  
A lightweight H2 in-memory database is used automatically — no external database setup is required.  
The H2 web console is available at **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:gbgdb`).

### 2 — Start the frontend (Vite dev server)

```bash
cd frontend
npm install        # only needed the first time
npm run dev
```

The app opens at **http://localhost:5173** (or the next available port printed in the terminal).  
All `/api/*` requests are automatically proxied to the backend at `http://localhost:8080`.

---

## Available scripts

### Backend
| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Run the dev server |
| `./mvnw test` | Run unit tests |
| `./mvnw package` | Build a production JAR (`target/*.jar`) |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot-reload |
| `npm run build` | Build the optimized production bundle |
| `npm run preview` | Preview the production build locally |

---

## Project structure

```
GBG/
├── backend/          # Spring Boot 3 REST API (Java 17, Maven)
│   └── src/main/
│       ├── java/com/gbg/   # Controllers, Services, Repositories, Models
│       └── resources/
│           └── application.properties
└── frontend/         # React 18 + Vite SPA
    ├── src/
    │   ├── api/      # Backend API helpers
    │   ├── components/
    │   └── hooks/
    └── vite.config.js
```
