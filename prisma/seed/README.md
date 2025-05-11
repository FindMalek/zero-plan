# Database Seed Data

This directory contains seed data for the database. The following data is seeded by default:

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

## Seeded Platforms

- Google
- GitHub
- AWS
- Microsoft

## Seeded Containers

Each user has the following containers:

- Personal
- Work
- Finance

## Seeded Tags

Each user has the following common tags:

- Important (#FF5733)
- Personal (#33FF57)
- Work (#3357FF)
- Finance (#F3FF33)
- Social (#FF33F3)

Additional container-specific tags are also created.

## Seeded Credentials

Each user has the following credentials:

- Google account
- GitHub account
- AWS account (in the Work container)

## Seeded Cards

Each user has the following cards in their Finance container:

- Visa credit card
- Mastercard

## Seeded Secrets

Each user has the following secrets in their Work container:

- AWS API Key
- GitHub Personal Access Token
- Development Database URL

## Running the Seeder

To run the seeder, use the following command:

```bash
pnpm db:seed
```

Note: All passwords are hashed using bcryptjs with a salt round of 10 before being stored in the database.
