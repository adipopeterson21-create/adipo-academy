const express = require('express');
const prisma = require('../prismaClient');
const { auth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/users', auth, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }});
  res.json(users);
});

module.exports = router;
