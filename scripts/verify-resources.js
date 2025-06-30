const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // You may need to install this: npm install chalk

// Script to verify that resources are properly accessible in the build
function verifyResources() {
  console.log(chalk.blue('🔍 Verifying STEM resources...'));
  
  const sourceDir = path.join(__dirname, '..', 'public', 'resources');
  const buildDir = path.join(__dirname, '..', 'dist', 'resources');
  
  // Check if source resources exist
  if (!fs.existsSync(sourceDir)) {
    console.error(chalk.red('❌ Source resources directory not found:', sourceDir));
    return false;
  }
  
  // Check if build resources directory exists
  if (!fs.existsSync(buildDir)) {
    console.error(chalk.red('❌ Build resources directory not found:', buildDir));
    console.log(chalk.yellow('⚠️ Did you run the build script first?'));
    return false;
  }
  
  // Get list of all subject directories
  const subjects = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log(chalk.blue(`Found ${subjects.length} subject directories: ${subjects.join(', ')}`));
  
  let allResourcesFound = true;
  let totalPdfs = 0;
  
  // Check each subject directory
  for (const subject of subjects) {
    const sourceSubjectDir = path.join(sourceDir, subject);
    const buildSubjectDir = path.join(buildDir, subject);
    
    // Check if build subject directory exists
    if (!fs.existsSync(buildSubjectDir)) {
      console.error(chalk.red(`❌ Build directory for subject '${subject}' not found`));
      allResourcesFound = false;
      continue;
    }
    
    // Get list of PDFs in source subject directory
    const pdfs = fs.readdirSync(sourceSubjectDir)
      .filter(file => file.toLowerCase().endsWith('.pdf'));
    
    totalPdfs += pdfs.length;
    console.log(chalk.blue(`${subject}: Found ${pdfs.length} PDFs`));
    
    // Check each PDF file
    for (const pdf of pdfs) {
      const sourcePdfPath = path.join(sourceSubjectDir, pdf);
      const buildPdfPath = path.join(buildSubjectDir, pdf);
      
      // Check if PDF exists in build directory
      if (!fs.existsSync(buildPdfPath)) {
        console.error(chalk.red(`❌ PDF file not found in build: ${subject}/${pdf}`));
        allResourcesFound = false;
        continue;
      }
      
      // Check file size
      const sourceSize = fs.statSync(sourcePdfPath).size;
      const buildSize = fs.statSync(buildPdfPath).size;
      
      if (sourceSize !== buildSize) {
        console.error(chalk.red(`❌ PDF file size mismatch for ${subject}/${pdf}`));
        console.log(`   Source: ${sourceSize} bytes, Build: ${buildSize} bytes`);
        allResourcesFound = false;
        continue;
      }
      
      console.log(chalk.green(`✓ ${subject}/${pdf} - ${sourceSize} bytes`));
    }
  }
  
  if (allResourcesFound) {
    console.log(chalk.green(`✅ All ${totalPdfs} PDF resources verified successfully!`));
  } else {
    console.log(chalk.red('❌ Some resources are missing or do not match.'));
  }
  
  console.log(chalk.blue('Verifying static fallback script...'));
  const staticJsPath = path.join(__dirname, '..', 'dist', 'js', 'static-fallback.js');
  
  if (fs.existsSync(staticJsPath)) {
    console.log(chalk.green('✅ Static fallback script found.'));
  } else {
    console.error(chalk.red('❌ Static fallback script not found!'));
    allResourcesFound = false;
  }
  
  return allResourcesFound;
}

// Run if called directly
if (require.main === module) {
  const success = verifyResources();
  process.exit(success ? 0 : 1);
}

module.exports = verifyResources;
