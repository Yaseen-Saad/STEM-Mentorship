#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Verifies that the application is ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let allChecksPass = true;

// Check 1: Required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'app.js',
  'vercel.json',
  'config/database.js',
  'models/Download.js',
  '.env.example',
  'scripts/build-static.js',
  'scripts/populate-db.js',
  '.github/workflows/deploy.yml'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allChecksPass = false;
  }
});

// Check 2: Package.json has required scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const requiredScripts = ['start', 'dev', 'build:static'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`   ✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`   ❌ ${script} - MISSING`);
    allChecksPass = false;
  }
});

// Check 3: Environment variables template
console.log('\n🔧 Checking environment configuration...');
if (fs.existsSync(path.join(__dirname, '..', '.env.example'))) {
  const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
  const requiredEnvVars = ['NODE_ENV', 'MONGODB_URI', 'PORT'];
  
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`   ✅ ${envVar} template exists`);
    } else {
      console.log(`   ❌ ${envVar} template missing`);
      allChecksPass = false;
    }
  });
} else {
  console.log('   ❌ .env.example file missing');
  allChecksPass = false;
}

// Check 4: Vercel configuration
console.log('\n🚀 Checking Vercel configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  
  if (vercelConfig.version === 2) {
    console.log('   ✅ Vercel version 2 configuration');
  } else {
    console.log('   ⚠️  Vercel version should be 2');
  }
  
  if (vercelConfig.builds && vercelConfig.builds.length > 0) {
    console.log('   ✅ Build configuration exists');
  } else {
    console.log('   ❌ Build configuration missing');
    allChecksPass = false;
  }
  
  if (vercelConfig.routes && vercelConfig.routes.length > 0) {
    console.log('   ✅ Route configuration exists');
  } else {
    console.log('   ❌ Route configuration missing');
    allChecksPass = false;
  }
} catch (error) {
  console.log('   ❌ Invalid vercel.json format');
  allChecksPass = false;
}

// Check 5: Static assets
console.log('\n🎨 Checking static assets...');
const staticDirs = ['public/css', 'public/js', 'public/resources'];

staticDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const files = fs.readdirSync(dirPath);
    console.log(`   ✅ ${dir} (${files.length} files)`);
  } else {
    console.log(`   ❌ ${dir} - MISSING`);
    allChecksPass = false;
  }
});

// Check 6: Sample PDFs for testing
console.log('\n📄 Checking sample PDF files...');
const pdfDirs = ['public/resources/math', 'public/resources/science', 'public/resources/english', 'public/resources/iq'];

pdfDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    const pdfFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.pdf'));
    if (pdfFiles.length > 0) {
      console.log(`   ✅ ${dir} (${pdfFiles.length} PDFs)`);
    } else {
      console.log(`   ⚠️  ${dir} (no PDF files for testing)`);
    }
  } else {
    console.log(`   ⚠️  ${dir} - Directory missing`);
  }
});

// Check 7: Dependencies
console.log('\n📚 Checking dependencies...');
const requiredDeps = ['express', 'ejs', 'mongoose', 'compression'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`   ❌ ${dep} - MISSING from dependencies`);
    allChecksPass = false;
  }
});

// Check 8: GitHub Actions workflow
console.log('\n🔄 Checking GitHub Actions workflow...');
const workflowPath = path.join(__dirname, '..', '.github/workflows/deploy.yml');
if (fs.existsSync(workflowPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  if (workflow.includes('npm run build:static')) {
    console.log('   ✅ GitHub Actions workflow configured');
  } else {
    console.log('   ⚠️  GitHub Actions workflow may be incomplete');
  }
} else {
  console.log('   ⚠️  GitHub Actions workflow missing (optional for manual deployment)');
}

// Final summary
console.log('\n' + '='.repeat(50));
if (allChecksPass) {
  console.log('🎉 All critical checks passed! Ready for deployment.');
  console.log('\n📋 Next steps:');
  console.log('   1. Local: npm run dev');
  console.log('   2. Vercel: Connect repo and set MONGODB_URI');
  console.log('   3. GitHub Pages: Push to main branch');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  console.log('\n🔧 Common fixes:');
  console.log('   - Run: npm install');
  console.log('   - Copy: cp .env.example .env');
  console.log('   - Create missing directories');
  process.exit(1);
}
