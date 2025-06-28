const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

// Enable compression
app.use(compression());

// Add cache control headers for static assets
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
  }
}));

// Middleware for error handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Remove duplicate static files middleware since we already have it with caching above

// Enhanced request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Application Error:', err);
    res.status(500).render('error', {
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {},
        lang: req.query.lang || 'en'
    });
});

// routes
app.get('/', (req, res, next) => {
    console.log("Rendering index page for language:", req.query.lang || 'en');
    try {
      res.render('index', { lang: req.query.lang || 'en' });
      console.log("Index page render call completed.");
    } catch (err) {
      console.error("Error rendering index.ejs:", err);
      next(err); // Pass to the error handler
    }
});
app.get('/about', (req, res) => res.render('about', { lang: req.query.lang || 'en' }));
app.get('/success', (req, res) => res.render('success', { lang: req.query.lang || 'en' }));
app.get('/program', (req, res) => res.render('program', { lang: req.query.lang || 'en' }));
app.get('/resources', (req, res) => res.render('resources', { lang: req.query.lang || 'en' }));
app.get('/contact', (req, res) => res.render('contact', { lang: req.query.lang || 'en' }));
app.get('/search', (req, res) => res.render('search', { lang: req.query.lang || 'en', query: req.query.q || '' }));

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  res.json({ query: q, results: [] });
});

// Download tracking endpoint
app.get('/api/track-resource', (req, res) => {
  const { type, subject, topic, redirect } = req.query;
  
  // Here you would typically log to a database or analytics service
  console.log(`Resource downloaded: ${type} - ${subject}/${topic}`);
  
  // For now, just increment a counter (in production, use a database)
  const trackingData = {
    timestamp: new Date().toISOString(),
    type: type || 'unknown',
    subject: subject || 'unknown',
    topic: topic || 'unknown',
    userAgent: req.headers['user-agent'],
    ip: req.ip
  };
  
  console.log('Download tracked:', trackingData);
  
  // Redirect to the actual resource
  if (redirect) {
    res.redirect(redirect);
  } else {
    res.status(200).json({ 
      success: true, 
      message: 'Download tracked successfully',
      data: trackingData 
    });
  }
});

// 404 handler
app.use((req, res, next) => {
  console.log('404 Error - Page not found:', req.url);
  try {
    res.status(404).render('404', { lang: req.query.lang || 'en' });
  } catch (error) {
    res.status(404).send('Page not found');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error('Stack:', err.stack);
  try {
    res.status(500).render('error', { lang: req.query.lang || 'en' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// For Vercel deployment
module.exports = app;
module.exports.default = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}