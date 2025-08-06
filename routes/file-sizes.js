// This API endpoint calculates actual file sizes for resources
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// In-memory cache for file sizes with expiration
const fileSizeCache = {
  timestamp: 0,
  data: {},
  // Cache expires after 30 minutes
  expirationTime: 30 * 60 * 1000
};

// API route to get file sizes
router.get('/file-sizes', (req, res) => {
  try {
    const currentTime = Date.now();
    const cacheAge = currentTime - fileSizeCache.timestamp;
    
    // Check if we have a recent cached version (less than expiration time)
    if (cacheAge < fileSizeCache.expirationTime && Object.keys(fileSizeCache.data).length > 0) {
      return res.json({
        success: true,
        data: fileSizeCache.data,
        fromCache: true,
        cacheAge: `${Math.round(cacheAge / 1000)} seconds`
      });
    }
    
    // Get the resource data JSON file
    const resourcesPath = path.join(__dirname, '..', 'public', 'js', 'resources-data.json');
    
    if (!fs.existsSync(resourcesPath)) {
      return res.status(404).json({
        success: false,
        message: 'Resources data file not found'
      });
    }
    
    // Read and parse the resources data
    const resourcesData = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
    const publicDir = path.join(__dirname, '..', 'public');
    const updatedData = {};
    
    // Update each resource with actual file size
    for (const subject in resourcesData) {
      if (!updatedData[subject]) {
        updatedData[subject] = [];
      }
      
      for (const resource of resourcesData[subject]) {
        const filePath = resource.filePath.startsWith('/') ? 
          resource.filePath.substring(1) : resource.filePath;
        const fullPath = path.join(publicDir, filePath);
        
        // Copy resource data
        const updatedResource = { ...resource };
        
        // Calculate file size if file exists
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          const fileSizeInBytes = stats.size;
          const fileSizeInKB = Math.round(fileSizeInBytes / 1024);
          
          if (fileSizeInKB < 1024) {
            updatedResource.fileSize = `${fileSizeInKB} KB`;
          } else {
            const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(1);
            updatedResource.fileSize = `${fileSizeInMB} MB`;
          }
        } else {
          updatedResource.fileSize = 'Unknown';
          console.warn(`File not found: ${fullPath}`);
        }
        
        updatedData[subject].push(updatedResource);
      }
    }
    
    // Update the cache
    fileSizeCache.data = updatedData;
    fileSizeCache.timestamp = currentTime;
    
    res.json({
      success: true,
      data: updatedData,
      fromCache: false
    });
    
  } catch (error) {
    console.error('Error calculating file sizes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error calculating file sizes'
    });
  }
});

// Route to get the file size for a specific file
router.get('/file-size/:filePath(*)', (req, res) => {
  try {
    // URL decode the file path parameter
    let filePath = decodeURIComponent(req.params.filePath);
    
    // Ensure the path starts with a slash if it doesn't already
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    
    // Remove any leading slash for joining with the public directory
    const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const publicDir = path.join(__dirname, '..', 'public');
    const fullPath = path.join(publicDir, relativePath);
    
    // Check if file exists and calculate size
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = Math.round(fileSizeInBytes / 1024);
      
      let formattedSize;
      if (fileSizeInKB < 1024) {
        formattedSize = `${fileSizeInKB} KB`;
      } else {
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(1);
        formattedSize = `${fileSizeInMB} MB`;
      }
      
      res.json({
        success: true,
        data: {
          path: filePath,
          sizeBytes: fileSizeInBytes,
          formattedSize: formattedSize
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: `File not found: ${filePath}`
      });
    }
  } catch (error) {
    console.error('Error getting file size:', error);
    res.status(500).json({
      success: false,
      message: 'Server error calculating file size'
    });
  }
});

module.exports = router;
