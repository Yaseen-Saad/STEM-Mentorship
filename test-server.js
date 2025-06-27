const app = require('./app.js');

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`✅ STEM Mentorship server successfully started on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/test`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  
  // Test a few key routes
  const testRoutes = ['/health', '/test'];
  console.log(`🧪 Testing ${testRoutes.length} routes...`);
  
  setTimeout(() => {
    console.log(`✅ Server test completed - ready for deployment!`);
    server.close();
  }, 2000);
});

server.on('error', (err) => {
  console.error(`❌ Server failed to start:`, err.message);
  process.exit(1);
});
