# 🏥 Swasthya+ (स्वास्थ्य+) — Healthcare Operating Platform

> **Next-Generation OPD Token Booking, Real-Time Live Queue Management & Modular Hospital Operating System.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Socket.io-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Monorepo Structure](#-monorepo-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start & Setup Guide](#-quick-start--setup-guide)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Role Workflows & Demonstration Guide](#-role-workflows--demonstration-guide)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🌟 Overview

**Swasthya+** is a comprehensive, production-grade Healthcare Operating Platform built to eliminate chaotic hospital queues, optimize OPD token generation, streamline doctor workflows, and empower patients with real-time wait time predictions.

Designed around a **Modular Monolith Architecture**, Swasthya+ supports multi-organization doctor context switching, instant walk-in token generation, real-time WebSocket queue updates, digital Rx prescription generation, and ABHA/ABDM healthcare ecosystem integration.

---

## 🔥 Key Features

### ⚡ Real-Time Live OPD Queue (WebSockets)
- **Instant Status Sync**: Uses WebSockets (`queue` namespace) to broadcast queue state changes live (`QUEUE_UPDATED`, `TOKEN_CALLED`, `TOKEN_SKIPPED`, `OPD_STARTED`).
- **Patient Queue Tracker Widget**: Displays `Currently Serving #18`, `Your Token #27`, `Patients Ahead: 8`, `Est. Wait: 45 min` with live visual progress bars.

### 🩺 Doctor Consultation & OPD Workspace
- **OPD Session Control**: Open, pause, or close OPD sessions dynamically.
- **Queue Actions**: One-click **Call Next**, **Skip**, **Hold**, and **Emergency Walk-in** priority insertion.
- **Digital Rx Builder**: Built-in prescription generator with medication search, dosage, frequency, duration, and printable PDF preview/download modal.
- **Multi-Organization Switcher**: Single doctor login allows seamless switching between multiple hospitals & clinics (e.g. *City Care Hospital* & *Sharma Skin Clinic*).

### 🏥 High-Speed Receptionist Desk
- **3-Step Walk-in Token Generator**: Rapid patient search and instant token issuance (`Token #27`).
- **Printable Receipts**: Thermal printer ready modal for physical token hand-out.
- **Payment Drawer Register**: Track cash, UPI, and card collections with daily drawer reconciliation reports.

### 📱 Mobile-First Patient Portal
- **Bottom Navigation Bar**: Optimized for smartphone usage.
- **Active Token Widget**: Live tracking from home, eliminating crowded waiting rooms.
- **Verified Doctor Directory**: Search doctors by specialty, ratings, fees, and real-time status.
- **Family Profiles**: Manage tokens & medical records for father, mother, spouse, and children under one account.

### 🏢 Hospital & Clinic Admin Console
- **Doctor Verification Workflow**: Review doctor credentials (`PENDING` → `VERIFIED` / `REJECTED` / `SUSPENDED`).
- **Department Manager**: Configure Cardiology, Dermatology, Orthopedics, Pediatrics, etc.
- **Platform Analytics & Telemetry**: Monitor average queue wait times, doctor consultation velocity, OPD peak hours, and audit logs.

### 🆔 ABDM & ABHA Integration Ready
- Modular ABHA service interfaces for card verification (`12-3456-7890-1234`), consent management, and digital health records payload compatibility.

---

## 🏗️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Web** | Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Socket.io-client |
| **Backend API** | NestJS 10, TypeORM, RxJS, Passport.js JWT, Swagger / OpenAPI |
| **Database** | PostgreSQL 16 |
| **Caching & Broker** | Redis 7 |
| **Real-Time Engine** | WebSockets (Socket.io) |
| **Monorepo Setup** | npm Workspaces (`apps/*`, `packages/*`) |

---

## 📁 Monorepo Structure

```text
swasthya-monorepo/
├── apps/
│   ├── api/                  # NestJS REST API + WebSocket Gateway
│   │   ├── src/
│   │   │   ├── modules/      # Auth, Users, Doctors, Patients, Queue, Audit, etc.
│   │   │   ├── common/       # Guards, Filters, Interceptors, Decorators
│   │   │   └── main.ts       # Application Bootstrap & Swagger setup
│   │   └── package.json
│   └── web/                  # Next.js 14 Frontend Web Application
│       ├── src/
│       │   ├── app/          # App Router Pages (Admin, Doctor, Receptionist, Patient)
│       │   └── components/   # UI components, modals, queue widgets
│       └── package.json
├── packages/
│   ├── config/               # Shared Role & Permission Enums
│   └── types/                # Shared TypeScript DTOs & Interfaces
├── docs/                     # Architecture, API Contracts & Progress docs
├── docker-compose.yml        # PostgreSQL & Redis infrastructure service setup
├── .env.example              # Environment variables template
└── package.json              # Monorepo root configuration
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Docker & Docker Compose** (Recommended for easy database & cache setup)

---

## 🚀 Quick Start & Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/swasthya-platform.git
cd swasthya-platform
```

### 2️⃣ Configure Environment Variables
Copy `.env.example` to create `.env` in the root directory:
```bash
cp .env.example .env
```

### 3️⃣ Start Database & Redis (via Docker)
Launch PostgreSQL and Redis containers in background:
```bash
docker-compose up -d
```
*(Verify containers are running with `docker ps`)*

### 4️⃣ Install Project Dependencies
Install all monorepo dependencies for web, api, and shared packages:
```bash
npm install
```

### 5️⃣ Run Development Servers
Start both NestJS Backend and Next.js Frontend concurrently:
```bash
npm run dev
```

The services will be available at:
- 🌐 **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend REST API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- 📖 **Swagger API Docs**: [http://localhost:4000/docs](http://localhost:4000/docs)

---

## 🔑 Environment Variables

Key parameters defined in `.env.example`:

| Key | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `4000` | NestJS API Server Port |
| `WEB_URL` | `http://localhost:3000` | Frontend Client URL |
| `DB_HOST` | `localhost` | PostgreSQL Database Host |
| `DB_PORT` | `5432` | PostgreSQL Port |
| `DB_DATABASE` | `swasthya_db` | Database Name |
| `REDIS_HOST` | `localhost` | Redis Server Host |
| `REDIS_PORT` | `6379` | Redis Port |
| `JWT_SECRET` | `swasthya_secret_key` | JWT Authentication Signing Key |
| `ENABLE_ABDM_INTEGRATION` | `false` | Enable/Disable ABDM Sandbox Integration |

---

## 📜 Available Scripts

Run these scripts from the project root:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs both NestJS backend and Next.js frontend concurrently |
| `npm run dev:api` | Runs NestJS API backend in watch mode |
| `npm run dev:web` | Runs Next.js web application on port 3000 |
| `npm run build:api` | Compiles NestJS backend into `dist/` |
| `npm run build:web` | Builds Next.js web app for production |

---

## 👥 Role Workflows & Demonstration Guide

You can navigate through the distinct user workflows using the navigation routes:

### 1. 🔑 Admin Panel (`/admin`)
- View system telemetry, active doctor count, total OPD tokens generated today.
- Manage doctor verification workflow (`PENDING` requests to `VERIFIED`).
- Access platform operational audit logs.

### 2. 🩺 Doctor OPD Console (`/doctor/schedule`)
- Select OPD workspace & organization context.
- Open OPD Session to activate queue.
- Use **Call Next** to advance patient tokens.
- Generate digital prescriptions via the Rx Builder.

### 3. 🏢 Receptionist Desk (`/receptionist`)
- Quick action dashboard for fast walk-in registration.
- Issue OPD tokens (`Token #27`) and print thermal receipts.
- Record payments (Cash / UPI / Card) and reconcile daily cash drawer.

### 4. 📱 Patient Portal (`/patient`)
- Track live OPD status (`Currently Serving #18`, `Patients Ahead: 8`).
- View estimated wait times in real time.
- View digital prescription history & ABHA identity status.

---

## 📖 API Documentation

Swasthya+ includes auto-generated OpenAPI/Swagger documentation.

Once the API is running, visit **[http://localhost:4000/docs](http://localhost:4000/docs)** to test endpoints interactively, explore request/response DTOs, and view authorization schemas.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p center="text-center">
Made with ❤️ for better healthcare accessibility.
</p>
