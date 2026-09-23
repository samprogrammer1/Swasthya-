# Swasthya+ Architecture Blueprint

## Overview
Swasthya+ is a healthcare operating platform designed initially for Jodhpur, Rajasthan, and scaling across India.
It utilizes a **Modular Monolith** architecture with strict domain module boundaries, backend-enforced authorization, and an **OPD Token + Live Queue** model.

## Core Identity Model
- **Central `User`**: Holds core authentication credentials (mobile, email, password hash), status, and assigned system roles.
- **Profile Extensions**:
  - `PatientProfile`: DOB, Gender, Blood group, Address, ABHA ID.
  - `DoctorProfile`: Qualification, Specialty, Registration Number, Verification Status, Consultation Fee, Ratings.
  - `ReceptionistProfile`: Associated Organization ID (Hospital or Clinic).
  - `AdminProfile`: Administrative privileges.

## Monorepo Layout
```text
swasthya/
├── apps/
│   ├── api/        # NestJS REST API + Guards + Module Services
│   └── web/        # Next.js 14 App Router + Tailwind CSS + Auth Context
├── packages/
│   ├── config/     # Role & Permission enums, constants
│   └── types/      # Shared TypeScript interfaces & DTOs
└── docs/           # Architecture, Progress, & API contracts
```

## Security & Authorization Matrix
- **Access Tokens**: Short-lived JWTs (15 mins) carrying user ID, roles, and granular permissions.
- **Refresh Tokens**: Long-lived JWTs (7 days) stored securely.
- **Guards**: `JwtAuthGuard` -> `RolesGuard` -> `PermissionsGuard`.
- **RBAC Roles**: `SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `RECEPTIONIST`, `PATIENT`, `HOSPITAL_ADMIN`, `CLINIC_ADMIN`.
