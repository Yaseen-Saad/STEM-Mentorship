const express = require('express');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

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

// API endpoint example
app.get('/api/search', (req, res) => {
  // placeholder logic
  const q = req.query.q || '';
  res.json({ query: q, results: [] });
});

// For serverless
module.exports.handler = serverless(app);

// Local start
if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
