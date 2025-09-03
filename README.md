![hero](github.png)

# Zero Planner

Zero Planner is an intelligent event planning application that makes scheduling effortless. Using AI-powered natural language processing, it transforms your casual descriptions into structured calendar events, helping you organize your life with minimal effort.

## Features

- **AI-Powered Event Generation:** Convert natural language descriptions into structured calendar events using OpenAI
- **Smart Parsing:** Automatically extract dates, times, locations, and event details from your input
- **Event Management:** Create, view, edit, and organize your events with an intuitive interface
- **Calendar Integration:** Comprehensive calendar system with support for recurring events and reminders
- **User Authentication:** Secure authentication using BetterAuth with modern authentication methods
- **Modern UI:** Beautiful and responsive interface built with React, Next.js, Tailwind CSS, and shadcn/ui
- **Real-time Processing:** Live event generation with processing status updates
- **Database Storage:** Reliable data persistence using PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js (v18 or higher) and pnpm installed
- Docker (for local PostgreSQL database)
- OpenAI API key for AI event generation

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/findmalek/zero-planner.git
   cd zero-planner
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the database:

   **Option A: Using Docker (Recommended for development)**

   Start the PostgreSQL database using Docker:

   ```bash
   pnpm docker:setup
   ```

   This will:

   - Start PostgreSQL container on port 5434
   - Push the Prisma schema to the database
   - Generate the Prisma client

   **Option B: Using existing PostgreSQL**

   If you have PostgreSQL already installed, create a database and update the connection string.

4. Set up environment variables:

   Copy the environment example and configure your variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your specific values:

   ```
   DATABASE_URL="postgresql://zero_plan_user:zero_plan_password@localhost:5434/zero_plan"
   BETTER_AUTH_SECRET="your-secret-key-here-min-10-chars"
   OPENAI_API_KEY="your-openai-api-key-here"
   OPENAI_URL="https://api.openai.com/v1"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

5. Run Prisma migrations (if not using docker:setup):

   ```bash
   pnpm db:migrate
   ```

6. Start the development server:
   ```bash
   pnpm run dev
   ```

## Database Management

### Docker Commands

- **Start database:** `pnpm docker:up`
- **Stop database:** `pnpm docker:down`
- **View database logs:** `pnpm docker:logs`
- **Restart database:** `pnpm docker:restart`
- **Complete setup:** `pnpm docker:setup` (starts DB, pushes schema, generates client)

### Prisma Commands

- **Push schema changes:** `pnpm db:push`
- **Create and run migration:** `pnpm db:migrate`
- **Open Prisma Studio:** `pnpm db:studio`
- **Generate Prisma client:** `pnpm db:generate`
- **Reset database with seeds:** `pnpm db:reset-and-seed`

## Usage

1. **Natural Language Input:** Describe your events in plain English:

   - "I have a doctor appointment tomorrow at 3 PM"
   - "Meeting with John next Friday at 10 AM in the conference room"
   - "Birthday party this Saturday at 8 PM"

2. **AI Processing:** The application uses OpenAI to parse your input and extract:

   - Event titles and descriptions
   - Dates and times
   - Locations
   - Event types and categories

3. **Event Management:** View, edit, and organize your generated events in a clean calendar interface

4. **Authentication:** Secure login and registration to keep your events private and synced

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API routes, tRPC/ORPC
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** BetterAuth
- **AI Integration:** OpenAI API
- **Deployment:** Vercel

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [hi@findmalek.com](mailto:hi@findmalek.com).
