// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('./middleware/rateLimit');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    credentials: true // Allow credentials (e.g., cookies, authorization headers)
}));

// Rate Limit for apis
// app.use(rateLimit);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// all routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');

// use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));