// api/test.js
export default function handler(req, res) {
  res.status(200).json({
    message: "API funcionando!",
    method: req.method,
    query: req.query,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasToken: !!process.env.INMOVILLA_TOKEN,
  });
}
