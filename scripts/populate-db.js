const mongoose = require('mongoose');
const Download = require('../models/Download');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stem-mentorship';

async function populateDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Sample data
    const sampleFiles = [
      {
        fileId: 'math-algebra-basics',
        fileName: 'Algebra Basics.pdf',
        subject: 'math',
        category: 'Algebra',
        filePath: 'resources/math/algebra-basics.pdf',
        downloadCount: 0
      },
      {
        fileId: 'math-geometry-fundamentals',
        fileName: 'Geometry Fundamentals.pdf',
        subject: 'math',
        category: 'Geometry',
        filePath: 'resources/math/geometry-fundamentals.pdf',
        downloadCount: 0
      },
      {
        fileId: 'science-chemistry-basics',
        fileName: 'Chemistry Fundamentals.pdf',
        subject: 'science',
        category: 'Chemistry',
        filePath: 'resources/science/chemistry-fundamentals.pdf',
        downloadCount: 0
      },
      {
        fileId: 'science-physics-mechanics',
        fileName: 'Physics Mechanics.pdf',
        subject: 'science',
        category: 'Physics',
        filePath: 'resources/science/physics-mechanics.pdf',
        downloadCount: 0
      },
      {
        fileId: 'english-grammar-guide',
        fileName: 'English Grammar Guide.pdf',
        subject: 'english',
        category: 'Grammar',
        filePath: 'resources/english/grammar-guide.pdf',
        downloadCount: 0
      },
      {
        fileId: 'iq-logical-reasoning',
        fileName: 'Logical Reasoning Tests.pdf',
        subject: 'iq',
        category: 'Logical Reasoning',
        filePath: 'resources/iq/logical-reasoning.pdf',
        downloadCount: 0
      }
    ];

    // Clear existing data
    await Download.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    for (const file of sampleFiles) {
      await Download.create(file);
      console.log(`Added: ${file.fileName}`);
    }

    console.log('Database populated successfully');
    process.exit(0);

  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase();
