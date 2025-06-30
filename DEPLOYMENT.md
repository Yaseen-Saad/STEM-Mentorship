# STEM Mentorship Platform - Deployment Configuration

This file contains platform-specific deployment instructions and configurations.

## 🏗️ Platform Support

| Platform | Status | Features | URL Pattern |
|----------|--------|----------|-------------|
| **Local Development** | ✅ Full | All features | http://localhost:3000 |
| **Vercel** | ✅ Full | All features | https://project.vercel.app |
| **GitHub Pages** | ⚠️ Static | Limited | https://user.github.io/repo |

## 🔧 Quick Setup Commands

### Local Development
```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Vercel Deployment
```bash
# Automatic via GitHub integration
# Or manual:
vercel --prod
```

### GitHub Pages
```bash
npm run build:static
# Push to main branch (auto-deploy via GitHub Actions)
```

## 🌍 Environment Variables

### Required for All Platforms
- `NODE_ENV`: development/production
- `PORT`: 3000 (local), auto (Vercel), N/A (GitHub Pages)

### Required for Database Features (Vercel/Local)
- `MONGODB_URI`: Your MongoDB connection string

### Example Configurations

#### Local Development (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stem-mentorship
```

#### Vercel (Environment Variables)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stem-mentorship
```

#### GitHub Pages (Static - No env needed)
```
# No environment variables needed
# Static files only
```

## 📁 File Structure for Deployment

```
├── .env.example              # Environment template
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment
├── scripts/
│   ├── build-static.js       # Static site generator
│   └── populate-db.js        # Database seeding
├── vercel.json               # Vercel configuration
├── app.js                    # Main application
└── public/                   # Static assets
```

## 🚀 Deployment Steps

### 1. Prepare Repository
1. Ensure all files are committed
2. Test locally with `npm start`
3. Verify environment variables are set

### 2. Deploy to Platforms

#### Vercel (Recommended for Full Features)
1. Connect GitHub repo to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push

#### GitHub Pages (Static Version)
1. Enable GitHub Pages in repository settings
2. Push to main branch
3. GitHub Actions will build and deploy

#### Local Testing
1. Install MongoDB locally or use Atlas
2. Run `npm run dev`
3. Test all features

## 🔍 Testing Deployments

### Health Checks
- **Local**: http://localhost:3000/health
- **Vercel**: https://yourapp.vercel.app/health
- **GitHub Pages**: Not available (static)

### Feature Testing
1. Navigate to resources page
2. Test PDF downloads (Vercel/Local only)
3. Check download statistics
4. Verify mobile responsiveness

## 🐛 Common Issues & Solutions

### MongoDB Connection Issues
```javascript
// Check connection in browser console or logs
fetch('/health').then(r => r.json()).then(console.log)
```

### Static Mode Detection
```javascript
// The app automatically detects static mode and shows appropriate messages
// Look for "Static Mode" notice on resources page
```

### Vercel Function Timeouts
- Check function logs in Vercel dashboard
- Ensure MongoDB Atlas is accessible
- Verify environment variables are set

## 📊 Monitoring & Analytics

### Built-in Monitoring
- Health check endpoint: `/health`
- Database status included in health response
- Console logging for all requests

### Error Handling
- Graceful fallback to static mode if database unavailable
- User-friendly error messages
- Automatic retry mechanisms

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` file
- Use secure connection strings for production
- Restrict database access to required IPs only

### MongoDB Atlas Setup
1. Create database user with minimal required permissions
2. Whitelist only necessary IP addresses
3. Use strong passwords
4. Enable connection encryption

## 📈 Performance Optimization

### Static Assets
- CSS/JS files cached for 1 year
- Image optimization recommended
- Compression enabled by default

### Database Queries
- Indexed fields for better performance
- Connection pooling configured
- Timeout handling implemented

## 🆘 Support & Troubleshooting

### Debug Information
```bash
# Check app status
curl https://yourapp.vercel.app/health

# Local debugging
npm run dev
# Check logs in terminal
```

### Common Commands
```bash
# Reset local database
node scripts/populate-db.js

# Build static version
npm run build:static

# Deploy to Vercel
vercel --prod

# Check Vercel logs
vercel logs
```
