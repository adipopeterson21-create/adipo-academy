const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const prisma = require('../prismaClient');
const { auth, requireAdmin } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const router = express.Router();

// list contents (requires auth)
router.get('/', auth, async (req, res) => {
  try {
    const items = await prisma.content.findMany({ orderBy: { createdAt: 'desc' }});
    res.json(items);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// admin upload
router.post('/upload', auth, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { title, description, isPremium } = req.body;
    const file = req.file;
    const mediaType = file.mimetype.startsWith('video/') ? 'VIDEO' : file.mimetype.startsWith('audio/') ? 'AUDIO' : file.mimetype.startsWith('image/') ? 'IMAGE' : file.mimetype === 'application/pdf' ? 'PDF' : 'OTHER';
    const content = await prisma.content.create({
      data: {
        title: title || file.originalname,
        description: description || '',
        mediaType,
        cloudinaryUrl: file.path || file.location || '',
        cloudinaryPublicId: file.filename || file.public_id || '',
        isPremium: isPremium === 'true' || isPremium === true,
        createdById: req.user.id
      }
    });
    res.json({ success: true, content });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Upload failed' }); }
});

// block/unblock user
router.post('/admin/block', auth, requireAdmin, async (req, res) => {
  try {
    const { userId, action } = req.body;
    const role = action === 'block' ? 'BLOCKED' : 'USER';
    const user = await prisma.user.update({ where: { id: userId }, data: { role }});
    res.json({ success: true, user });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// toggle premium on content
router.post('/admin/toggle-premium', auth, requireAdmin, async (req, res) => {
  try {
    const { contentId, isPremium } = req.body;
    const content = await prisma.content.update({ where: { id: contentId }, data: { isPremium: !!isPremium }});
    res.json({ success: true, content });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// create stripe payment intent (placeholder)
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 500,
      currency: 'usd',
      metadata: { userId: req.user.id }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment error' });
  }
});

module.exports = router;
