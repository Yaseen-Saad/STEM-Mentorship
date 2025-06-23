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

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  res.json({ query: q, results: [] });
});

const handler = serverless(app);
module.exports = handler;
module.exports.handler = handler;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
