const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Build static HTML files for GitHub Pages deployment
async function buildStatic() {
  console.log('Building static version for GitHub Pages...');
  
  const distDir = path.join(__dirname, '..', 'dist');
  
  // Create dist directory
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Create directories for JS, CSS and resources
  const jsDir = path.join(distDir, 'js');
  const cssDir = path.join(distDir, 'css');
  const resourcesDir = path.join(distDir, 'resources');
  
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }
  
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }
  
  // Copy public assets
  const publicDir = path.join(__dirname, '..', 'public');
  
  console.log('Copying public assets...');
  copyDir(publicDir, distDir);
  
  // Generate static HTML files
  const viewsDir = path.join(__dirname, '..', 'views');
  const pages = ['index', 'about', 'contact', 'program', 'resources', 'success'];
  
  for (const page of pages) {
    console.log(`Generating ${page}.html...`);
    try {
      const templatePath = path.join(viewsDir, `${page}.ejs`);
      
      if (fs.existsSync(templatePath)) {
        const html = await ejs.renderFile(templatePath, {
          lang: 'en'
        });
        
        fs.writeFileSync(path.join(distDir, `${page}.html`), html);
      }
    } catch (error) {
      console.error(`Error generating ${page}.html:`, error);
    }
  }
  
  // Create a fallback JavaScript file for resources page
  const resourcesJS = `
// Static fallback for GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
  console.log('Running in static mode (GitHub Pages)');
  window.isStaticMode = true;
  
  // Show notice that dynamic features are not available
  const notice = document.createElement('div');
  notice.className = 'static-mode-notice';
  notice.style.margin = '20px auto';
  notice.style.padding = '15px 20px';
  notice.style.background = 'linear-gradient(135deg, #fff3cd, #ffeaa7)';
  notice.style.border = '2px solid #856404';
  notice.style.borderRadius = '10px';
  notice.style.color = '#856404';
  notice.style.textAlign = 'center';
  notice.style.maxWidth = '800px';
  notice.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  notice.innerHTML = 
    '⚠️ <strong>Static GitHub Pages Mode</strong><br>' +
    'You\\'re viewing a static version of this site.<br>' +
    'Download tracking and statistics are not available, but PDF downloads still work.<br>' +
    'For full tracking and statistics, visit the live site.';
  
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(notice, container.firstChild);
  }
  
  // Load static resources data
  loadStaticResourcesData();
  
  // Enable direct downloads instead of API
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach(btn => {
    const fileId = btn.getAttribute('data-file-id');
    if (fileId) {
      // Convert file-id to path
      // Format is: subject-filename
      const parts = fileId.split('-');
      if (parts.length >= 2) {
        const subject = parts[0];
        const filename = parts.slice(1).join('-');
        
        // Create correct path to the PDF file in the resources directory
        const resourcePath = '/resources/' + subject + '/' + filename + '.pdf';
        
        // Replace click handler
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('Static mode: Direct download', resourcePath);
          
          // Create a download link
          const a = document.createElement('a');
          a.href = resourcePath;
          a.download = btn.getAttribute('data-file-name') || 'download.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      }
    }
  });
  
  // Update counters with static text
  const counters = document.querySelectorAll('.download-count');
  counters.forEach(counter => {
    counter.innerHTML = '<span class="material-icons">cloud_download</span> <span class="count">Static</span>';
  });
  
  // Mock API calls
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      console.log('Static mode: Intercepting API call', url);
      
      // For stats endpoint
      if (url === '/api/stats') {
        return Promise.resolve({
          ok: true,
          json: function() {
            return Promise.resolve({
              success: true,
              data: {
                totalFiles: 6,
                totalDownloads: '-',
                bySubject: [
                  { _id: 'math', totalDownloads: '-', fileCount: 2 },
                  { _id: 'science', totalDownloads: '-', fileCount: 2 },
                  { _id: 'english', totalDownloads: '-', fileCount: 1 },
                  { _id: 'iq', totalDownloads: '-', fileCount: 1 }
                ]
              }
            });
          }
        });
      }
      
      // For file listing endpoints
      if (url.startsWith('/api/files/')) {
        const subject = url.split('/').pop();
        
        // Return static data for each subject
        const files = getStaticFilesForSubject(subject);
        return Promise.resolve({
          ok: true,
          json: function() {
            return Promise.resolve({
              success: true,
              data: files
            });
          }
        });
      }
    }
    
    // Pass through other requests
    return originalFetch(url, options);
  };
  
  // Function to get static files data for a subject
  function getStaticFilesForSubject(subject) {
    // This could be enhanced to actually scan the directories
    const staticFiles = {
      math: [
        {
          fileId: 'math-algebra-basics',
          fileName: 'Algebra Basics.pdf',
          subject: 'math',
          category: 'Algebra',
          filePath: 'resources/math/algebra-basics.pdf',
          downloadCount: '-'
        },
        {
          fileId: 'math-geometry-fundamentals',
          fileName: 'Geometry Fundamentals.pdf',
          subject: 'math',
          category: 'Geometry',
          filePath: 'resources/math/geometry-fundamentals.pdf',
          downloadCount: '-'
        }
      ],
      science: [
        {
          fileId: 'science-chemistry-fundamentals',
          fileName: 'Chemistry Fundamentals.pdf',
          subject: 'science',
          category: 'Chemistry',
          filePath: 'resources/science/chemistry-fundamentals.pdf',
          downloadCount: '-'
        },
        {
          fileId: 'science-physics-mechanics',
          fileName: 'Physics Mechanics.pdf',
          subject: 'science',
          category: 'Physics',
          filePath: 'resources/science/physics-mechanics.pdf',
          downloadCount: '-'
        }
      ],
      english: [
        {
          fileId: 'english-grammar-guide',
          fileName: 'English Grammar Guide.pdf',
          subject: 'english',
          category: 'Grammar',
          filePath: 'resources/english/grammar-guide.pdf',
          downloadCount: '-'
        }
      ],
      iq: [
        {
          fileId: 'iq-logical-reasoning',
          fileName: 'Logical Reasoning Tests.pdf',
          subject: 'iq',
          category: 'Logical Reasoning',
          filePath: 'resources/iq/logical-reasoning.pdf',
          downloadCount: '-'
        }
      ]
    };
    
    return staticFiles[subject] || [];
  }
  
  // Function to load static resources
  function loadStaticResourcesData() {
    const subjects = ['math', 'science', 'english', 'iq'];
    subjects.forEach(function(subject) {
      const files = getStaticFilesForSubject(subject);
      renderStaticSubjectResources(subject, files);
    });
  }
  
  // Function to render static resources
  function renderStaticSubjectResources(subject, resources) {
    const container = document.getElementById(subject + '-content');
    if (!container) return;
    
    const resourcesGrid = container.querySelector('.resource-cards-grid');
    if (!resourcesGrid) return;
    
    resources.forEach(function(resource, index) {
      const card = document.createElement('div');
      card.className = 'resource-card';
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', (index * 100).toString());
      
      card.innerHTML = 
        '<div class="card-header">' +
        '  <div class="resource-type">PDF</div>' +
        '</div>' +
        '<div class="card-content">' +
        '  <h3>' + resource.fileName + '</h3>' +
        '  <p>' + resource.category + '</p>' +
        '  <div class="resource-stats">' +
        '    <span class="file-size">PDF</span>' +
        '    <span class="download-count">' +
        '      <span class="material-icons">download</span>' +
        '      <span class="count">Static</span>' +
        '    </span>' +
        '  </div>' +
        '</div>' +
        '<div class="card-actions">' +
        '  <button class="btn btn-primary download-btn"' +
        '          data-file-id="' + resource.fileId + '"' +
        '          data-file-name="' + resource.fileName + '">' +
        '    <span class="material-icons">download</span>' +
        '    Download' +
        '  </button>' +
        '</div>';
      
      resourcesGrid.appendChild(card);
    });
  }
});
`;
  
  fs.writeFileSync(path.join(distDir, 'js', 'static-fallback.js'), resourcesJS);
  
  // Create a custom 404 page for GitHub Pages
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - STEM Mentorship</title>
  <link rel="stylesheet" href="css/style.css">
  <script>
    // Redirect to index.html if page not found
    setTimeout(function() {
      window.location.href = '/index.html';
    }, 3000);
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <p>Redirecting to home page in 3 seconds...</p>
    <a href="index.html" style="color: #007bff; text-decoration: none;">Go Home Now</a>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);
  
  console.log('Static build completed!');
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Run if called directly
if (require.main === module) {
  buildStatic().catch(console.error);
}

module.exports = buildStatic;
