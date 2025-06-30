const mongoose = require('mongoose');

// Download schema for tracking PDF downloads
const downloadSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['math', 'science', 'english', 'iq']
  },
  category: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
downloadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to increment download count
downloadSchema.statics.incrementDownload = async function(fileId) {
  const result = await this.findOneAndUpdate(
    { fileId },
    { 
      $inc: { downloadCount: 1 },
      $set: { updatedAt: Date.now() }
    },
    { new: true, upsert: false }
  );
  return result;
};

// Static method to get download stats
downloadSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$subject',
        totalDownloads: { $sum: '$downloadCount' },
        fileCount: { $sum: 1 }
      }
    }
  ]);
  return stats;
};

module.exports = mongoose.model('Download', downloadSchema);
