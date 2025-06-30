# 🚀 Quick Start Guide

Get your STEM Mentorship platform running in minutes!

## ⚡ One-Command Setup

```bash
# Clone and setup everything
git clone <your-repo>
cd stem-mentorship
npm run setup
```

This will:
- Install all dependencies
- Run deployment checks
- Verify all files are in place

## 🏃‍♂️ Quick Deployment

### 1. Local Development (2 minutes)
```bash
# Install and check
npm run setup

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```
**URL:** http://localhost:3000

### 2. Vercel Deployment (5 minutes)
```bash
# Option A: Automatic (Recommended)
# 1. Push code to GitHub
# 2. Connect repo to Vercel
# 3. Set MONGODB_URI in Vercel dashboard
# 4. Deploy automatically

# Option B: Manual
npm install -g vercel
vercel --prod
```

### 3. GitHub Pages (3 minutes)
```bash
# Push to GitHub (static version)
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# GitHub Actions will automatically build and deploy
```

## 🔧 Environment Variables

### Local (.env file)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stem-mentorship
```

### Vercel (Dashboard Settings)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stem-mentorship
```

## 📊 Database Quick Setup

### Option 1: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Create database user
4. Get connection string
5. Add to MONGODB_URI

### Option 2: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
mongod

# Will connect to: mongodb://localhost:27017/stem-mentorship
```

## ✅ Verify Deployment

### Check Health Status
```bash
# Local
curl http://localhost:3000/health

# Vercel
curl https://your-app.vercel.app/health

# Should return: {"status":"ok","database":"connected",...}
```

### Test Features
1. Visit resources page
2. Try downloading a PDF
3. Check download statistics update
4. Test on mobile device

## 🐛 Quick Troubleshooting

### "MongoDB connection failed"
```bash
# Check if MongoDB is running
mongod --version

# Or use MongoDB Atlas connection string
```

### "Port already in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Or change port in .env
PORT=3001
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Vercel deployment fails"
- Check function logs in Vercel dashboard
- Verify environment variables are set
- Ensure MONGODB_URI is correct

## 📱 Platform-Specific Features

| Platform | Download PDFs | Statistics | Database | Mobile |
|----------|---------------|------------|----------|---------|
| **Local** | ✅ | ✅ | ✅ | ✅ |
| **Vercel** | ✅ | ✅ | ✅ | ✅ |
| **GitHub Pages** | ❌ | ❌ | ❌ | ✅ |

## 🎯 Next Steps

After successful deployment:

1. **Customize Content**: Edit views/*.ejs files
2. **Add Resources**: Place PDFs in public/resources/
3. **Update Database**: Use /test-setup endpoint
4. **Monitor**: Check logs and /health endpoint
5. **Scale**: Add more PDF categories and subjects

## 📞 Need Help?

1. Run deployment check: `npm run check-deployment`
2. Check server health: Visit `/health` endpoint
3. Review logs: Terminal (local) or Vercel dashboard
4. Test static mode: `npm run build:static`

---

**🏆 Success!** Your STEM Mentorship platform is now ready to help students worldwide access quality educational resources.
