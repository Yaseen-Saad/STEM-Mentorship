const express = require('express');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

// Middleware for error handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', (req, res) => res.render('index', { lang: req.query.lang || 'en' }));
app.get('/about', (req, res) => res.render('about', { lang: req.query.lang || 'en' }));
app.get('/success', (req, res) => res.render('success', { lang: req.query.lang || 'en' }));
app.get('/program', (req, res) => res.render('program', { lang: req.query.lang || 'en' }));
app.get('/resources', (req, res) => res.render('resources', { lang: req.query.lang || 'en' }));
app.get('/contact', (req, res) => res.render('contact', { lang: req.query.lang || 'en' }));
app.get('/search', (req, res) => res.render('search', { lang: req.query.lang || 'en', query: req.query.q || '' }));

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
  res.status(404).render('index', { lang: req.query.lang || 'en' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('index', { lang: req.query.lang || 'en' });
});

const handler = serverless(app);

// For Vercel
module.exports = handler;
module.exports.handler = handler;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
