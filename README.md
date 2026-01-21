
# Bastats

A basketball performance tracking web application built with Next.js, Prisma, and MySQL.

## Features

- **Player Roster**: Manage your players with photos and details.
- **Exercise Library**: Define drills and exercises with custom units.
- **Progress Tracking**: Log results for players.
- **Visual Analytics**: 
  - Individual player progress charts per exercise.
  - Team average progress charts per exercise.
- **Premium Design**: Dark mode aesthetic with glassmorphism UI.

## Setup Instructions

### 1. Database Configuration
Ensure you have a MySQL server running (e.g., via XAMPP, WAMP, or Docker).
Create a database named `bastats`.

Update the `.env` file with your credentials:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/bastats"
```
Example for XAMPP (default):
```env
DATABASE_URL="mysql://root:@localhost:3306/bastats"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Migration
Run the following command to create the database tables:
```bash
npx prisma migrate dev --name init
```
**Note:** If `prisma migrate` fails due to environment issues on Windows, explicitly set the variable:
```powershell
$env:DATABASE_URL="mysql://root:@localhost:3306/bastats"; npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🚀 Deployment (CloudPanel)

### 1. Create a Node.js Site
- Domain: `your-domain.com`
- App Type: `Node.js`
- App Port: `3000`

### 2. Environment Variables
In the "Settings" or "Environment" tab of your site on CloudPanel, add the following variables. **Do not** modify the file in your local project, or you will break your local access.

```env
# Database Connection (from your CloudPanel Database tab)
DATABASE_URL="mysql://bastats_user:SECRET_PASSWORD@127.0.0.1:3306/bastats_db"

# Admin Security (REQUIRED)
# Choose a strong password to protect your site
ADMIN_PASSWORD="MySuperSecretPassword123!"

# Optimization
NODE_ENV="production"
```

### 3. Build & Run
In the "Node.js" tab:
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Run Command**: `npm start`

### 4. Database Setup (Production)
Since we removed migration files:
1. Go to phpMyAdmin on CloudPanel.
2. Select your new empty database.
3. Import the `.sql` file you exported from your local machine.
   *(This ensures your production DB has exactly the same structure and data as your local one)*.
