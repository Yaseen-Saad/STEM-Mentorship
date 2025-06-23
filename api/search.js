// Serverless search function placeholder
module.exports = async (req, res) => {
  const { q = '' } = req.query;
  // TODO: implement search logic (e.g., full-text search in resources)
  return res.json({ query: q, results: [] });
};
