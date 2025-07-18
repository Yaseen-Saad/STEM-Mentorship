# STEM Mentorship Platform

A modern educational platform providing comprehensive STEM resources, practice tests, and mentorship programs with MongoDB-powered PDF download tracking.

## 🚀 Features

- **Modern UI/UX**: Responsive design with smooth animations
- **Resource Library**: Subject-organized PDFs with MongoDB download tracking
- **PDF Management**: Real-time download counters and analytics
- **Contact Management**: Social media integration and contact forms
- **Performance Optimized**: Fast loading with fallback mechanisms
- **Mobile Friendly**: Responsive design for all devices
- **Bilingual Support**: Arabic/English language switching
- **Database Integration**: MongoDB with Mongoose for data persistence
- **API Endpoints**: RESTful API for resource management

## 🛠️ Technical Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating with modern CSS
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel serverless functions
- **Styling**: Custom CSS with animations (AOS)

## 🔧 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/stem-mentorship
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running locally or use MongoDB Atlas

4. **Populate database with sample data:**
   ```bash
   node scripts/populate-db.js
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Start production server:**
   ```bash
   npm start
   ```

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/stem-mentorship`

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

### Database Schema
- **Downloads Collection**: Tracks PDF downloads with counters
- **File Metadata**: Stores file information (name, subject, category, path)
- **Analytics**: Real-time download statistics by subject

## 🌐 API Endpoints

### Resource Management
- `GET /api/download/:fileId` - Download PDF and increment counter
- `GET /api/stats/:fileId` - Get download stats for specific file
- `GET /api/stats` - Get overall download statistics
- `GET /api/files/:subject` - Get all files for a subject
- `POST /api/files` - Add/update file records

### Utility
- `GET /health` - Health check
- `GET /test-setup` - Quick database setup with sample data

## 🔧 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

4. **Check for syntax errors:**
   ```bash
   node -c app.js
   ```

## 🌐 Deployment Guide

This application can be deployed in three different environments:

### 1. Local Development

**Prerequisites:**
- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)

**Setup:**
```bash
# 1. Clone and setup
git clone <your-repo>
cd stem-mentorship

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Update .env with your settings
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stem-mentorship

# 5. Start MongoDB (if using local)
mongod

# 6. Populate database with sample data
node scripts/populate-db.js

# 7. Start development server
npm run dev
```

**Access:** http://localhost:3000

### 2. GitHub Pages (Static Mode)

GitHub Pages serves static files only, so dynamic features (downloads, stats) won't work.

**Setup:**
```bash
# 1. Enable GitHub Pages in repository settings
# 2. Push code to main branch
# 3. GitHub Actions will automatically build and deploy

# Manual build for testing:
npm run build:static
```

**Features Available:**
- ✅ All static pages (home, about, contact, etc.)
- ✅ Responsive design and animations
- ❌ PDF downloads and tracking
- ❌ Database features

**Access:** https://yourusername.github.io/repository-name

### 3. Vercel (Full Featured)

Vercel provides serverless Node.js hosting with MongoDB support.

**Automatic Deployment:**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stem-mentorship
   ```
3. Deploy automatically on push to main branch

**Manual Deployment:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

**Environment Variables for Vercel:**
- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB Atlas connection string

**Features Available:**
- ✅ All static pages
- ✅ PDF downloads with tracking
- ✅ Real-time statistics
- ✅ Database functionality
- ✅ API endpoints

**Access:** https://your-project.vercel.app

## 📊 Database Setup

### Local MongoDB
```bash
# Install MongoDB Community Server
# Start MongoDB service
mongod

# The app will connect to mongodb://localhost:27017/stem-mentorship
```

### MongoDB Atlas (Recommended for Production)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create new cluster (free tier available)
3. Create database user
4. Get connection string
5. Update MONGODB_URI in environment variables

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/stem-mentorship
```

## 🔧 Environment Configuration

Create `.env` file based on `.env.example`:

```env
# Development
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stem-mentorship

# Production (Vercel)
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stem-mentorship
```

## 🚨 Troubleshooting

### Local Development Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/stem-mentorship`

**Port Already in Use:**
- Change PORT in `.env` file
- Or kill process: `lsof -ti:3000 | xargs kill`

### Vercel Deployment Issues

**504 Gateway Timeout:**
- Check function logs in Vercel dashboard
- Verify MongoDB connection string
- Ensure database is accessible from Vercel

**Environment Variables:**
- Set in Vercel dashboard under Project Settings
- Redeploy after adding variables

**API Routes Not Working:**
- Check `vercel.json` configuration
- Verify routes are properly defined

### GitHub Pages Issues

**Dynamic Features Not Working:**
- This is expected - GitHub Pages is static only
- Use Vercel for full functionality

**Build Failures:**
- Check GitHub Actions logs
- Ensure all dependencies are in `package.json`

## 📋 Deployment Checklist

### Before Deploying:

- [ ] Test locally with `npm start`
- [ ] Verify all environment variables are set
- [ ] Check MongoDB connection
- [ ] Test API endpoints with `/health`
- [ ] Run `npm run build:static` for GitHub Pages

### For Production:

- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Set secure environment variables
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Test all download links
- [ ] Verify error handling works

### Post-Deployment:

- [ ] Visit `/health` endpoint to check status
- [ ] Test PDF downloads
- [ ] Check download statistics
- [ ] Test on mobile devices
- [ ] Monitor logs for errors

## Project Structure

- `/public` - Static assets (CSS, JS, images)
- `/views` - EJS templates
  - `/partials` - Reusable EJS components
- `/api` - Serverless API functions
- `app.js` - Express application setup
- `vercel.json` - Vercel deployment configuration