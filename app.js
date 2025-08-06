const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

// Database connection
const connectDB = require('./config/database');
const Download = require('./models/Download');

const app = express();

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize MongoDB connection with error handling
let mongoConnected = false;
connectDB()
  .then(() => {
    mongoConnected = true;
    if (isDevelopment) {
      console.log('MongoDB connected successfully');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    if (isDevelopment) {
      console.log('Running without database (static mode)');
    }
  });

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

// Enhanced request logging (development only)
app.use((req, res, next) => {
  if (isDevelopment) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
  }
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
  try {
    res.render('index', { lang: req.query.lang || 'en' });
  } catch (err) {
    console.error("Error rendering index.ejs:", err);
    next(err); // Pass to the error handler
  }
});
app.get('/about', (req, res) => res.render('about', { lang: req.query.lang || 'en' }));
app.get('/success', (req, res) => res.render('success', { lang: req.query.lang || 'en' }));
app.get('/program', (req, res) => res.render('program', { lang: req.query.lang || 'en' }));
app.get('/resources', (req, res) => {
  // Get resources data for server-side rendering
  try {
    // Check if we have the resources JSON file
    res.render('resources', {
      lang: req.query.lang || 'en'
    });

  } catch (error) {
    console.error('Error rendering resources page:', error);
    res.render('resources', { lang: req.query.lang || 'en' });
  }
});
app.get('/contact', (req, res) => res.render('contact', { lang: req.query.lang || 'en' }));
app.get('/search', (req, res) => res.render('search', { lang: req.query.lang || 'en', query: req.query.q || '' }));

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Health check route with database status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  res.json({ query: q, results: [] });
});

// PDF Download endpoint with MongoDB tracking
app.get('/api/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Check if database is connected
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Download tracking disabled.'
      });
    }

    // Find the file in database
    const downloadRecord = await Download.findOne({ fileId });

    if (!downloadRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file exists on disk
    const filePath = path.join(__dirname, 'public', downloadRecord.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Increment download count
    await Download.incrementDownload(fileId);

    // Set appropriate headers for PDF download - force download
    res.setHeader('Content-Type', 'application/octet-stream'); // Forces download in most browsers
    res.setHeader('Content-Disposition', `attachment; filename="${downloadRecord.fileName}"`);
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Add cross-browser download support
    res.setHeader('X-Download-Options', 'noopen'); // Prevents IE from opening PDFs in the browser
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Log download in development
    if (isDevelopment) {
      console.log(`PDF downloaded: ${downloadRecord.fileName} (ID: ${fileId})`);
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during download'
    });
  }
});

// Get download statistics for a specific file
app.get('/api/stats/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Check if database is connected
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Statistics disabled.'
      });
    }

    const downloadRecord = await Download.findOne({ fileId });

    if (!downloadRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      data: {
        fileId: downloadRecord.fileId,
        fileName: downloadRecord.fileName,
        subject: downloadRecord.subject,
        category: downloadRecord.category,
        downloadCount: downloadRecord.downloadCount,
        lastUpdated: downloadRecord.updatedAt
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting statistics'
    });
  }
});

// Get all download statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Check if database is connected
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Statistics disabled.'
      });
    }

    const stats = await Download.getStats();
    const totalFiles = await Download.countDocuments();
    const totalDownloads = await Download.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalFiles,
        totalDownloads: totalDownloads.length > 0 ? totalDownloads[0].total : 0,
        bySubject: stats
      }
    });

  } catch (error) {
    console.error('Overall stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting overall statistics'
    });
  }
});

// Add/Update file in database (for admin use)
app.post('/api/files', async (req, res) => {
  try {
    const { fileId, fileName, subject, category, filePath } = req.body;

    if (!fileId || !fileName || !subject || !category || !filePath) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const downloadRecord = await Download.findOneAndUpdate(
      { fileId },
      {
        fileId,
        fileName,
        subject,
        category,
        filePath,
        updatedAt: Date.now()
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json({
      success: true,
      message: 'File record created/updated successfully',
      data: downloadRecord
    });

  } catch (error) {
    console.error('File creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating file record'
    });
  }
});

// Get all files for a subject
app.get('/api/files/:subject', async (req, res) => {
  try {
    const { subject } = req.params;

    const files = await Download.find({ subject }).sort({ category: 1, fileName: 1 });

    res.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('Files retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving files'
    });
  }
});

// Download tracking endpoint
app.get('/api/track-resource', async (req, res) => {
  const { type, subject, topic, redirect } = req.query;
  
  try {
    // Record download in database if connected
    if (mongoConnected) {
      // Build fileId to match our naming convention
      const fileId = `${subject}-${topic}`;
      
      // Look up the file record
      let downloadRecord = await Download.findOne({ fileId });
      
      if (downloadRecord) {
        // Increment the download count
        downloadRecord.downloadCount += 1;
        downloadRecord.updatedAt = Date.now();
        await downloadRecord.save();
      } else {
        // Create a new record if it doesn't exist
        const filePath = `/resources/${subject}/${topic}.pdf`;
        downloadRecord = new Download({
          fileId,
          fileName: `${topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}.pdf`,
          subject,
          category: topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' '),
          filePath,
          downloadCount: 1
        });
        await downloadRecord.save();
      }
      
      // Fetch the updated record to ensure we have the latest count
      // This handles race conditions if multiple downloads occur at once
      const freshRecord = await Download.findOne({ fileId });
      const downloadCount = freshRecord ? freshRecord.downloadCount : downloadRecord.downloadCount;
      
      // Tracking data for response
      const trackingData = {
        timestamp: new Date().toISOString(),
        type: type || 'unknown',
        subject: subject || 'unknown',
        topic: topic || 'unknown',
        fileId,
        downloadCount: downloadCount
      };
      
      if (isDevelopment) {
        console.log('Download tracked:', trackingData);
      }
      
      // Redirect to the actual resource if requested
      if (redirect) {
        res.redirect(redirect);
      } else {
        res.status(200).json({ 
          success: true, 
          message: 'Download tracked successfully',
          data: trackingData 
        });
      }
    } else {
      // Static mode tracking (just logging in development)
      if (isDevelopment) {
        console.log(`Resource downloaded: ${type} - ${subject}/${topic} (static mode)`);
      }
      
      // Build fileId to match our naming convention
      const fileId = `${subject}-${topic}`;
      
      // Tracking data for response
      const trackingData = {
        timestamp: new Date().toISOString(),
        type: type || 'unknown',
        subject: subject || 'unknown',
        topic: topic || 'unknown',
        fileId,
        // In static mode, we don't have real counts
        downloadCount: 1
      };
      
      // Redirect to the actual resource if requested
      if (redirect) {
        res.redirect(redirect);
      } else {
        res.status(200).json({ 
          success: true, 
          message: 'Download request logged (static mode)',
          data: trackingData 
        });
      }
    }
  } catch (error) {
    console.error('Error tracking download:', error);
    
    // Still respond successfully to not interrupt the download
    res.status(200).json({ 
      success: false, 
      message: 'Error tracking download, but download will continue',
      error: error.message
    });
  }
});

// Serve resources data from JSON or MongoDB
app.get('/api/resources', async (req, res) => {
  try {
    let resourceData;

    if (mongoConnected) {
      // Fetch from MongoDB if available
      resourceData = await Download.find().lean();

      // Transform to subject-organized structure
      const organizedData = {};
      resourceData.forEach(item => {
        if (!organizedData[item.subject]) {
          organizedData[item.subject] = [];
        }
        organizedData[item.subject].push(item);
      });

      res.json({
        success: true,
        data: organizedData
      });
    } else {
      // Use static JSON file as fallback
      const resourcesPath = path.join(__dirname, 'public', 'js', 'resources-data.json');
      if (fs.existsSync(resourcesPath)) {
        resourceData = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
        res.json({
          success: true,
          data: resourceData
        });
      } else {
        throw new Error('Resources data not found');
      }
    }
  } catch (error) {
    console.error('Error serving resources data:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving resources data'
    });
  }
});

// Import routes
const fileSizesRouter = require('./routes/file-sizes');

// Use routes
app.use('/api', fileSizesRouter);

// 404 handler
app.use((req, res, next) => {
  // Skip Chrome DevTools and other system requests to reduce noise
  if (req.url.includes('.well-known') || req.url.includes('devtools')) {
    return res.status(404).end();
  }

  if (isDevelopment) {
    console.log('404 Error - Page not found:', req.url);
  }
  try {
    res.status(404).render('404', { lang: req.query.lang || 'en' });
  } catch (error) {
    console.error('Error rendering 404 page:', error);
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Page Not Found - 404</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/" style="color: #007bff; text-decoration: none;">Go Home</a>
      </body>
      </html>
    `);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error('Stack:', err.stack);
  try {
    res.status(500).render('error', { lang: req.query.lang || 'en' });
  } catch (error) {
    console.error('Error rendering error page:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Server Error - 500</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>500 - Internal Server Error</h1>
        <p>We are experiencing technical difficulties. Please try again later.</p>
        <a href="/" style="color: #007bff; text-decoration: none;">Go Home</a>
      </body>
      </html>
    `);
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