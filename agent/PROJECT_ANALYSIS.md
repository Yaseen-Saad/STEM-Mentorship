# STEM Mentorship Platform - Project Analysis

## Project Overview
A modern educational platform providing STEM resources, practice tests, and mentorship programs with MongoDB-powered PDF download tracking.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating with modern CSS
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel serverless functions
- **Styling**: Custom CSS with AOS animations

## Current Features

### 1. Resource Management System
- **PDF Download Tracking**: MongoDB-based download counters
- **Subject Organization**: Math, Science, English, IQ categories
- **File Size Calculation**: Dynamic file size detection with caching
- **Download Statistics**: Per-file and overall download analytics

### 2. Web Interface
- **Responsive Design**: Mobile-friendly with hamburger menu
- **Multi-language Support**: Arabic/English switching
- **Modern UI/UX**: Smooth animations with AOS library
- **Page Templates**: Home, About, Resources, Contact, Program pages

### 3. API Endpoints
- `/api/download/:fileId` - PDF download with tracking
- `/api/stats/:fileId` - Individual file statistics
- `/api/stats` - Overall download statistics
- `/api/resources` - Resource data (MongoDB or JSON fallback)
- `/api/files/:subject` - Subject-specific files
- `/api/track-resource` - Download tracking endpoint
- `/api/file-sizes` - File size calculation with caching
- `/api/search` - Basic search functionality

### 4. Database Integration
- **MongoDB Connection**: Graceful fallback to static mode
- **Download Model**: File tracking with metadata
- **Statistics Aggregation**: Subject-wise download stats
- **Data Population**: Scripts for database seeding

## Architecture Benefits
1. **Graceful Degradation**: Works without database connection
2. **Caching Strategy**: File size caching for performance
3. **Error Handling**: Comprehensive error management
4. **Deployment Ready**: Vercel-optimized configuration
5. **Development Tools**: Scripts for setup and verification

## Current File Structure
```
├── app.js (Main server file)
├── package.json (Dependencies)
├── vercel.json (Deployment config)
├── api/ (Vercel API routes)
├── config/ (Database configuration)
├── models/ (MongoDB schemas)
├── routes/ (Express routes)
├── views/ (EJS templates)
├── public/ (Static assets)
└── scripts/ (Utility scripts)
```
