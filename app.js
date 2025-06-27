const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Global request timeout middleware (25 seconds - before Vercel's 30-second limit)
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error(`⚠️  Request timeout: ${req.method} ${req.path}`);
      res.status(408).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Request Timeout</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #dc3545; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
            .btn:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⏱️ Request Timeout</h1>
            <p>The request took too long to process. This might be due to high server load.</p>
            <a href="/" class="btn">🏠 Return Home</a>
            <a href="/test" class="btn">🔧 Test Server</a>
          </div>
        </body>
        </html>
      `);
    }
  }, 25000);

  res.on('finish', () => clearTimeout(timeout));
  res.on('close', () => clearTimeout(timeout));
  next();
});

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files with aggressive caching
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: false,
  lastModified: false,
  immutable: true
}));

// EJS setup with no caching
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);

// Request logging
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to render with timeout
function renderWithTimeout(res, view, data = {}, fallbackHtml = '') {
  return new Promise((resolve) => {
    const renderTimeout = setTimeout(() => {
      if (!res.headersSent) {
        console.warn(`⚠️  EJS render timeout for view: ${view}`);
        res.send(fallbackHtml || `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>STEM Mentorship Platform</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; }
              .container { max-width: 1200px; margin: 0 auto; text-align: center; padding: 40px 20px; }
              h1 { font-size: 3rem; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .nav { margin: 40px 0; }
              .btn { display: inline-block; padding: 15px 30px; margin: 10px; background: rgba(255,255,255,0.2); color: white; text-decoration: none; border-radius: 50px; backdrop-filter: blur(10px); transition: all 0.3s; }
              .btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 STEM Mentorship Platform</h1>
              <p style="font-size: 1.2rem; margin-bottom: 30px;">Empowering Students Through Quality Education</p>
              <div class="nav">
                <a href="/about" class="btn">📖 About Us</a>
                <a href="/program" class="btn">🎓 Programs</a>
                <a href="/resources" class="btn">📚 Resources</a>
                <a href="/contact" class="btn">📞 Contact</a>
                <a href="/success" class="btn">⭐ Success Stories</a>
              </div>
              <p style="margin-top: 40px; opacity: 0.8;">Fast-loading fallback page • Server is operational</p>
            </div>
          </body>
          </html>
        `);
      }
      resolve();
    }, 8000); // 8-second timeout for EJS rendering

    res.render(view, data, (err, html) => {
      clearTimeout(renderTimeout);
      if (err) {
        console.error(`❌ EJS render error for ${view}:`, err.message);
        if (!res.headersSent) {
          res.send(fallbackHtml || `
            <h1>STEM Mentorship Platform</h1>
            <p>Welcome to our educational platform!</p>
            <p><em>Fallback mode - ${view} view failed to load</em></p>
            <nav>
              <a href="/">Home</a> | 
              <a href="/about">About</a> | 
              <a href="/resources">Resources</a> | 
              <a href="/contact">Contact</a>
            </nav>
          `);
        }
      } else if (!res.headersSent) {
        res.send(html);
      }
      resolve();
    });
  });
}

// Immediate response routes (no EJS rendering)
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end('{"status":"OK","timestamp":"' + new Date().toISOString() + '"}');
});

app.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Test</title>
      <style>
        body { font-family: monospace; padding: 20px; background: #000; color: #0f0; }
        .status { padding: 10px; background: #111; border-left: 4px solid #0f0; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>🟢 STEM Server Status</h1>
      <div class="status">✅ Server is running</div>
      <div class="status">⏰ Current time: ${new Date().toISOString()}</div>
      <div class="status">🌐 Node.js: ${process.version}</div>
      <div class="status">💾 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</div>
      <div class="status">⚡ Uptime: ${Math.round(process.uptime())} seconds</div>
      <p><a href="/" style="color: #0ff;">← Back to Homepage</a></p>
    </body>
    </html>
  `);
});

app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(faviconPath);
  } else {
    res.status(204).end();
  }
});

// Main routes with EJS rendering and fallbacks
app.get('/', async (req, res) => {
  await renderWithTimeout(res, 'index', { lang: req.query.lang || 'en' });
});

app.get('/about', async (req, res) => {
  await renderWithTimeout(res, 'about', { lang: req.query.lang || 'en' }, `
    <h1>About STEM Mentorship</h1>
    <p>We provide comprehensive STEM education and mentorship programs.</p>
    <p><a href="/">← Back to Home</a></p>
  `);
});

app.get('/program', async (req, res) => {
  await renderWithTimeout(res, 'program', { lang: req.query.lang || 'en' }, `
    <h1>STEM Programs</h1>
    <p>Our programs include Mathematics, Science, English, and IQ preparation.</p>
    <p><a href="/">← Back to Home</a></p>
  `);
});

app.get('/resources', async (req, res) => {
  await renderWithTimeout(res, 'resources', { lang: req.query.lang || 'en' }, `
    <h1>Educational Resources</h1>
    <p>Access our comprehensive collection of study materials and practice tests.</p>
    <p><a href="/">← Back to Home</a></p>
  `);
});

app.get('/contact', async (req, res) => {
  await renderWithTimeout(res, 'contact', { lang: req.query.lang || 'en' }, `
    <h1>Contact Us</h1>
    <p>Get in touch with our STEM mentorship team.</p>
    <p><a href="/">← Back to Home</a></p>
  `);
});

app.get('/success', async (req, res) => {
  await renderWithTimeout(res, 'success', { lang: req.query.lang || 'en' }, `
    <h1>Success Stories</h1>
    <p>Read about our students' achievements and success stories.</p>
    <p><a href="/">← Back to Home</a></p>
  `);
});

app.get('/search', async (req, res) => {
  await renderWithTimeout(res, 'search', { 
    lang: req.query.lang || 'en', 
    query: req.query.q || '' 
  }, `
    <h1>Search Results</h1>
    <p>Search query: ${req.query.q || 'None'}</p>
    <p><a href="/">← Back to Home</a></p>
  `);
});

// API routes
app.get('/api/search', (req, res) => {
  res.json({ 
    query: req.query.q || '', 
    results: [],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/track-resource', (req, res) => {
  const { type, subject, topic, redirect } = req.query;
  
  console.log(`📊 Resource downloaded: ${type} - ${subject}/${topic}`);
  
  const trackingData = {
    timestamp: new Date().toISOString(),
    type: type || 'unknown',
    subject: subject || 'unknown',
    topic: topic || 'unknown',
    userAgent: req.headers['user-agent'],
    ip: req.ip
  };
  
  if (redirect) {
    res.redirect(redirect);
  } else {
    res.json({ 
      success: true, 
      message: 'Download tracked successfully',
      data: trackingData 
    });
  }
});

// 404 handler - no EJS rendering to prevent loops
app.use((req, res) => {
  console.log(`❌ 404 Error - Page not found: ${req.url}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Page Not Found - STEM Mentorship</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #dc3545; font-size: 4rem; margin: 0; }
        .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page <code>${req.url}</code> could not be found.</p>
        <a href="/" class="btn">🏠 Return Home</a>
        <a href="/test" class="btn">🔧 Test Server</a>
      </div>
    </body>
    </html>
  `);
});

// Error handler - no EJS rendering to prevent loops
app.use((err, req, res, next) => {
  console.error(`💥 Server Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  
  if (!res.headersSent) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Error - STEM Mentorship</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #dc3545; }
          .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ Server Error</h1>
          <p>Something went wrong on our end. Please try again later.</p>
          <a href="/" class="btn">🏠 Return Home</a>
          <a href="/test" class="btn">🔧 Test Server</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Export for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 STEM Mentorship server running on port ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
  });
}
