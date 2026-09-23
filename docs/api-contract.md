# Swasthya+ API Contract (Phase 0 & Phase 1)

Base URL: `/api/v1`

## Health Check
- `GET /health` (Public) - System health check.
- `GET /api/v1/health` (Public) - API v1 service and infrastructure state.

## Authentication (`/api/v1/auth`)
- `POST /auth/request-otp` (Public)
  - Request: `{ "mobile": "+919876543212" }`
  - Response: `{ "success": true, "data": { "message": "OTP sent successfully to +919876543212", "testOtp": "123456" } }`

- `POST /auth/verify-otp` (Public)
  - Request: `{ "mobile": "+919876543212", "otp": "123456" }`
  - Response: `{ "success": true, "data": { "accessToken": "...", "refreshToken": "...", "user": { ... } } }`

- `POST /auth/refresh` (Public)
  - Request: `{ "refreshToken": "..." }`
  - Response: `{ "success": true, "data": { "accessToken": "..." } }`

- `POST /auth/logout` (Bearer Auth)
  - Response: `{ "success": true, "data": { "message": "Successfully logged out" } }`

- `GET /auth/me` (Bearer Auth)
  - Response: `{ "success": true, "data": { "sub": "usr_doctor_01", "roles": ["DOCTOR"], "permissions": [...] } }`

## Users (`/api/v1/users`)
- `GET /users/me` (Bearer Auth) - Retrieve full user record & linked profiles.
- `PATCH /users/me` (Bearer Auth) - Update user personal details.
