# Deployment Guide

## 1. What is this?
This is a **Web Application** built with **Next.js**.
- It runs in a web browser (Chrome, Safari, etc.) on both mobile and desktop.
- It is not a native mobile app (like an .apk or .ipa file), but it is responsive and works like an app.

## 2. How to Host (Share with others)
The easiest and best way to host this application is using **Vercel** (the creators of Next.js). It is free for hobby projects and very easy to set up.

### Prerequisites
1.  A **GitHub** account (to store your code).
2.  A **Vercel** account (create one at [vercel.com](https://vercel.com) using your GitHub account).
3.  Your **MongoDB Atlas** connection string (from your `.env` file).

### Step 1: Push Code to GitHub
1.  Create a new repository on GitHub (e.g., `trackar-fleet-app`).
2.  Push your local code to this repository:
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/trackar-fleet-app.git
    git push -u origin main
    ```

### Step 2: Deploy to Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `trackar-fleet-app` repository.
4.  In the **"Configure Project"** screen:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables**: You MUST add these (copy values from your local `.env` file):
        *   `DATABASE_URL`: Your MongoDB connection string (e.g., `mongodb+srv://...`).
        *   `NEXTAUTH_SECRET`: Your secret key (e.g., `your-secret-key`).
        *   `NEXTAUTH_URL`: The URL of your deployed site (e.g., `https://trackar-fleet-app.vercel.app`). *Note: You can add this after the first deployment once you know the URL, or let Vercel handle it automatically.*
5.  Click **"Deploy"**.

### Step 3: Configure MongoDB Atlas
For Vercel to connect to your database, you need to allow access from anywhere (since Vercel IP addresses change).
1.  Go to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
2.  Go to **"Network Access"** (in the left sidebar).
3.  Click **"Add IP Address"**.
4.  Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
5.  Click **"Confirm"**.

### Step 4: Verify
Once Vercel finishes building, it will give you a URL (e.g., `https://trackar-fleet-app.vercel.app`).
- Open this URL on your phone or share it with others.
- Log in with the same credentials you used locally (e.g., `admin@trackar.com` / `admin123`).

## Troubleshooting
- **Build Failed?** Check the "Logs" tab in Vercel. It usually tells you if a dependency is missing.
- **Database Error?** Check if you added the `DATABASE_URL` correctly in Vercel Environment Variables and if MongoDB Network Access is set to `0.0.0.0/0`.
