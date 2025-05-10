# Database Seed Data

This directory contains seed data for the database. The following users are seeded by default:

## Seeded Users

### 1. John Doe

- **Email**: <john.doe@example.com>
- **Password**: SecurePass123!
- **Avatar**: <https://avatar.vercel.sh/john.doe>

### 2. Jane Smith

- **Email**: <jane.smith@example.com>
- **Password**: SecurePass123!
- **Avatar**: <https://avatar.vercel.sh/jane.smith>

### 3. Mike Johnson

- **Email**: <mike.johnson@example.com>
- **Password**: SecurePass123!
- **Avatar**: <https://avatar.vercel.sh/mike.johnson>

## Running the Seeder

To run the seeder, use the following command:

```bash
pnpm db:seed
```

Note: All passwords are hashed using bcryptjs with a salt round of 10 before being stored in the database.
