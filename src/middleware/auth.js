const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

async function auth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id }});
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    if (user.role === 'BLOCKED') return res.status(403).json({ error: 'User blocked' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'No user' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  next();
}

module.exports = { auth, requireAdmin };
