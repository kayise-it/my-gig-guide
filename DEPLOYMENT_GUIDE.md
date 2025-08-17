# Deployment Guide

## Environment Configuration

This guide explains how to configure your My Gig Guide application for different environments.

### Localhost Development

When working on localhost, use these configurations:

#### Backend (.env file in backend folder)
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=my_gig_guide_db
DB_DIALECT=mysql
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
```

#### Frontend (.env file in frontend folder)
```env
# Optional - config.js automatically uses localhost:3001 in development mode
VITE_API_BASE_URL=http://localhost:3001
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### VPS Production

When deploying to VPS, use these configurations:

#### Backend (.env file in backend folder)
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_vps_db_host
DB_USER=your_vps_db_user
DB_PASSWORD=your_vps_db_password
DB_NAME=your_vps_db_name
DB_DIALECT=mysql
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
```

#### Frontend (.env file in frontend folder)
```env
VITE_API_BASE_URL=http://62.72.18.206
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Setup Instructions

### 1. Create Environment Files

1. Copy `backend/env.example` to `backend/.env`
2. Copy `frontend/env.example` to `frontend/.env`
3. Update the values according to your environment

### 2. Database Setup

#### Localhost (MAMP/XAMPP)
- **IMPORTANT**: Start MAMP MySQL server first
- Use the default MySQL settings
- Database name: `my_gig_guide_db`
- Username: `root`
- Password: `root`

#### VPS
- Create a MySQL database on your VPS
- Update the database credentials in `backend/.env`

### 3. Running the Application

#### Development (localhost)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

#### Production (VPS)
```bash
# Build frontend
cd frontend
npm install
npm run build

# Start backend
cd backend
npm install
npm start
```

## Important Notes

- **Never commit `.env` files** - they are in `.gitignore`
- The frontend automatically detects development mode and uses localhost:3001
- In production, the frontend uses the `VITE_API_BASE_URL` environment variable
- Always use strong, unique JWT secrets in production
- Update Google Maps API key for your domain in production
- **Ensure MySQL is running before starting the backend**

## Troubleshooting

### Common Issues

1. **Database Connection Error (ETIMEDOUT)**: 
   - Start MAMP MySQL server
   - Check if MySQL is running on port 3306
   - Verify database credentials in `.env`

2. **CORS errors**: Ensure the backend CORS settings match your frontend URL
3. **Port conflicts**: Change the PORT in .env if 3001 is already in use
4. **Environment variables not loading**: Ensure .env files are in the correct locations

### Environment Detection

The application uses these methods to detect the environment:
- Frontend: `import.meta.env.MODE` (set by Vite)
- Backend: `process.env.NODE_ENV` (set in .env file)
