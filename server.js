require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ 
  origin: 'https://my-portfolio-okue.onrender.com', 
  methods: ['GET','POST','PUT','DELETE','OPTIONS'], 
  allowedHeaders: ['Content-Type','Authorization'] 
}));
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
