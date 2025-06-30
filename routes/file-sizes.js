// This API endpoint calculates actual file sizes for resources
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// API route to get file sizes
router.get('/file-sizes', (req, res) => {
  try {
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
      
      resourcesData[subject].forEach(resource => {
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
      });
    }
    
    res.json({
      success: true,
      data: updatedData
    });
    
  } catch (error) {
    console.error('Error calculating file sizes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error calculating file sizes'
    });
  }
});

module.exports = router;
