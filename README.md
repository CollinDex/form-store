# VantikLabs Backend Assessment - Dynamic Form API

## 🚀 Overview

A robust Node.js backend for creating versioned dynamic forms and handling submissions. This API supports complex schema validation, version control, and asynchronous processing for high performance.

## 🛠️ Tech Stack

- **Language:** TypeScript (Node.js/Express)
- **Database:** PostgreSQL (TypeORM)
- **Queue:** Redis + Bull (for email notifications)
- **Validation:** Zod (Static) + Custom Middleware (Dynamic DB Checks)
- **Docs:** Swagger UI

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

### Quick Start

1.  **Clone the repository**

    ```bash
    git clone <your-repo-link>
    cd form-store
    ```

2.  **Setup Environment**
    Copy the example env file:

    ```bash
    cp .env.example .env
    ```

    _Update `.env` with your DB credentials if strictly necessary, or leave defaults for Docker._

3.  **Start Infrastructure (Postgres + Redis)**

    ```bash
    docker-compose up -d
    ```

4.  **Install Dependencies & Run**

    ```bash
    yarn install
    yarn run start:dev
    ```

5.  **Access the API**
    - **Swagger Docs:** `http://localhost:3000/api/docs`
    - **Health Check:** `http://localhost:3000/api/v1`

## ⚖️ Architecture Decisions & Trade-offs

### 1. Hybrid Storage (SQL + JSONB)

- **Decision:** I used PostgreSQL `jsonb` for the form schema and submission answers.
- **Why:** While relational tables ensure data integrity for core entities (`Form`, `FormVersion`), a rigid SQL schema cannot efficiently handle user-defined fields. `jsonb` offers NoSQL flexibility with ACID compliance.

### 2. Validation

- **Layer 1 (Static):** Zod middleware validates the request structure (e.g., ensuring IDs are UUIDs).
- **Layer 2 (Dynamic):** A custom middleware fetches the active `FormSchema` from the DB and validates user input against it before the controller processes the request.

### 3. Asynchronous Architecture

- **Decision:** Integrated **Redis + Bull** for email notifications.
- **Why:** Submitting a form is a critical user action. By offloading side effects (emails) to a background queue, the API responds instantly, and retries are handled automatically if the email provider fails.

### 4. Security

- **Authentication:** JWT-based middleware extracts user context.
- **Role-Based Access Control (RBAC):** Admin routes are strictly protected.
