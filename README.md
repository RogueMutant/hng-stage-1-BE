# HNG Stage 1 Backend

This is a RESTful API built for the HNG Stage 1 backend project. The application takes a user's name, interacts with external public APIs (Genderize.io, Agify.io, and Nationalize.io) to predict demographic information, classifies the data according to business logic, and persists the result using Prisma and SQLite.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/) (v7)
- **Database:** SQLite (`better-sqlite3`)

## Features

- **Profile Generation:** Accurately predicts age, gender, and nationality based on a given name using external APIs running in parallel for speed.
- **Data Persistence:** Stores and retrieves generated profiles using an embedded SQLite database.
- **Idempotent Operations:** Prevents duplicate external API calls by checking the local database first.
- **Data Classification:** Categorizes profiles into predefined `age_groups` correctly.
- **Modern Architecture:** Employs a robust Controller-Service-Repository pattern.

## Local Setup & Installation

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Build and Push Database Schema

Generate the Prisma client and push the schema to the SQLite database:

```bash
npm run build
```

_(Note: If you want to sync the schema manually, run `npx prisma db push`)_

### 4. Start the Application

To start the application in development mode with hot-reloading:

```bash
npm run dev
```

To start the compiled application in production mode:

```bash
npm run start
```

By default, the server runs on `http://localhost:3000`.

---

## API Endpoints

### 1. Add a Profile

- **Method:** `POST`
- **Endpoint:** `/api/profiles`
- **Body:**
  ```json
  {
    "name": "Alex"
  }
  ```

### 2. Get All Profiles

- **Method:** `GET`
- **Endpoint:** `/api/profiles`
- **Response:** Returns an array of all saved profiles.

### 3. Get Profile by ID

- **Method:** `GET`
- **Endpoint:** `/api/profiles/:id`
- **Response:** Returns the specifics of a single stored profile.

### 4. Delete a Profile

- **Method:** `DELETE`
- **Endpoint:** `/api/profiles/:id`
- **Response:** Deletes the specified profile from the database.

---

## Deployment

This project is configured to deploy effortlessly on platforms like **Railway** .
The `npm run start` script automatically pushes the Prisma schema (`prestart`) to accommodate ephemeral SQLite usage.
