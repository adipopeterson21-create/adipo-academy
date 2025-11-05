const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const prisma = require('../prismaClient');

const router = express.Router();

router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // if no webhook secret (testing) parse JSON
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata && paymentIntent.metadata.userId;
    if (userId) {
      try {
        await prisma.user.update({ where: { id: userId }, data: { isPremium: true }});
        console.log('User marked premium:', userId);
      } catch (err) {
        console.error('Failed to mark user premium', err);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;
