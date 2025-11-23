# Trackar - Fleet Management SaaS

Trackar is a modern Fleet Management System built with Next.js 14, PostgreSQL, Prisma, and Socket.IO. It supports 4 user roles: Admin, Fleet Owner, Driver, and Client.

## 🚀 Quick Start Guide (VS Code)

Follow these steps to run the project locally using VS Code terminals.

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (Installed and running)
- **VS Code**

### 2. Environment Setup
1.  Open the project folder in VS Code.
2.  Create a new file named `.env` in the root directory.
3.  Copy the following content into `.env`:

```env
# Database Connection (Ensure your Postgres password is correct)
DATABASE_URL="postgresql://postgres:password@localhost:5432/trackar"

# NextAuth Configuration
NEXTAUTH_SECRET="supersecretkey123"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps (Optional - Leave as is for dev)
NEXT_PUBLIC_MAPS_API_KEY="YOUR_MAPS_API_KEY"
```

### 3. Database Setup (Terminal 1)
Open a new terminal in VS Code (`Ctrl + ~`) and run these commands one by one:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start PostgreSQL Service:**
    *   *Windows*: Search for "Services", find `postgresql-x64-16` (or similar), right-click -> **Start**.
    *   *Verify*: The service must be running for the next steps to work.

3.  **Initialize Database:**
    ```bash
    npx prisma db push
    ```
    *Success message: "🚀  Your database is now in sync with your Prisma schema."*

4.  **Seed Dummy Data:**
    ```bash
    npm run prisma:seed
    ```
    *Success message: "Seeding finished."*

### 4. Run the Application (Terminal 1)
In the same terminal, start the development server:

```bash
npm run dev
```

### 5. Access the App
Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

**Login Credentials:**
*   **Admin**: `admin@example.com` / `password123`
*   **Fleet Owner**: `owner@example.com` / `password123`
*   **Driver**: `driver@example.com` / `password123`
*   **Client**: `client@example.com` / `password123`

## 🛠 Troubleshooting

*   **"Connection refused" / Database Errors**:
    *   Ensure PostgreSQL service is running.
    *   Check if the password in `.env` matches your local Postgres password.
    *   If your Postgres user is not `postgres`, update the `DATABASE_URL`.

*   **"Prisma Client not initialized"**:
    *   Run `npx prisma generate` and restart the server.

*   **Build Errors**:
    *   Run `npm run build` to check for errors.
    *   If you see type errors, try `npm install` again.

## 📂 Project Structure
*   `/app`: Next.js App Router pages.
*   `/components`: UI components (Sidebar, Maps, etc.).
*   `/lib`: Utility functions and database client.
*   `/prisma`: Database schema and seed script.
*   `/server`: Custom Socket.IO server.
