# Trip Planner API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.28.1-green.svg)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5.16.2-orange.svg)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A robust RESTful API for trip planning and management built with TypeScript, Fastify, and Prisma ORM.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
- [License](#license)

## ✨ Features

- Create and manage trips with destinations and date ranges
- Add and confirm participants for trips
- Schedule activities for trips
- Store useful links related to trips
- Email notifications for trip confirmations

## 🛠️ Tech Stack

- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language
- **[Fastify](https://www.fastify.io/)**: Fast and low overhead web framework
- **[Prisma](https://www.prisma.io/)**: Next-generation ORM for Node.js and TypeScript
- **[SQLite](https://www.sqlite.org/)**: Lightweight, file-based database
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- **[Nodemailer](https://nodemailer.com/)**: Module for email sending
- **[Day.js](https://day.js.org/)**: Lightweight date library

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trip-planner-api.git
   cd trip-planner-api
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env file with the following variables
   DATABASE_URL="file:./dev.db"
   # Add other environment variables as needed for email configuration, etc.
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Docker Setup

You can also run the application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t trip-planner-api .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 -d trip-planner-api
   ```

Alternatively, use Docker Compose:
   ```bash
   docker compose up -d
   ```

## 📡 API Endpoints

The API provides the following endpoints:

- `POST /trips`: Create a new trip
- `POST /trips/:id/confirm`: Confirm a trip
- `POST /participants/:id/confirm`: Confirm a participant

For detailed API documentation, refer to the API documentation (coming soon).

## 🗄️ Database Schema

The database includes the following models:

- **Trip**: Stores trip information including destination and date range
- **Participant**: Manages people joining the trip
- **Activity**: Schedules activities during the trip
- **Link**: Stores useful links related to the trip

## 👨‍💻 Development

To contribute to the project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.
