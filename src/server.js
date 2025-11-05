require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const webhooks = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');

const app = express();

// Stripe webhook requires raw body. Mount webhook route with raw body parser before express.json.
app.use('/api/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/webhooks', webhooks);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin.html')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Adipo Academy server running on port ${PORT}`);
});
