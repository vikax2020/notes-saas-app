# Notes SaaS App

A multi-tenant SaaS Notes Application allowing multiple companies (tenants) to securely manage their users and notes with role-based access and subscription limits.

## Features

- **Multi-Tenancy:** Supports multiple tenants with strict data isolation.
- **Authentication & Authorization:** JWT-based login with roles:
  - Admin: Invite users, upgrade subscriptions.
  - Member: Create, view, edit, delete notes.
- **Subscription Plans:**
  - Free: Max 3 notes per tenant.
  - Pro: Unlimited notes.
- **Notes API (CRUD):**
  - POST /notes – Create a note
  - GET /notes – List all notes
  - GET /notes/:id – Retrieve a specific note
  - PUT /notes/:id – Update a note
  - DELETE /notes/:id – Delete a note
- **Frontend:** Minimal UI to login, list, create, delete notes, and show "Upgrade to Pro" when the free plan limit is reached.
- **Deployment:** Backend and frontend hosted on Vercel with CORS enabled and a health endpoint: `GET /health → { "status": "ok" }`.

## Test Accounts

| Email              | Role   | Tenant |
|-------------------|--------|--------|
| admin@acme.test    | Admin  | Acme   |
| user@acme.test     | Member | Acme   |
| admin@globex.test  | Admin  | Globex |
| user@globex.test   | Member | Globex |

## Tech Stack

- Node.js / Express (Backend)
- React  (Frontend)
- JWT Authentication
- Vercel Deployment
