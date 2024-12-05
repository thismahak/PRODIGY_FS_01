const express = require("express");
const app = express();
require('dotenv').config();
const connectDB = require("./config/db");

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use authentication routes from /routes/auth
app.use('/api/auth', require("./routes/auth"));



// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
