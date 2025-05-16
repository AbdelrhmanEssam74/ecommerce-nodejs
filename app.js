require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./router/adminRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Database Connection error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

