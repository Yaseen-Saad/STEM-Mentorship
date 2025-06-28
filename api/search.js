// Serverless search function implementation
module.exports = async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q.trim()) {
      return res.json({ query: q, results: [] });
    }

    // Mock search results for demonstration
    // In production, this should be connected to a proper database
    const results = [
      {
        title: 'STEM Preparation Guide',
        description: 'Comprehensive guide for STEM school preparation',
        type: 'resource'
      },
      {
        title: 'Mathematics Practice Tests',
        description: 'Collection of practice tests for STEM mathematics',
        type: 'assessment'
      }
    ].filter(item =>
      item.title.toLowerCase().includes(q.toLowerCase()) ||
      item.description.toLowerCase().includes(q.toLowerCase())
    );

    return res.json({
      query: q,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process search request'
    });
  }
};
