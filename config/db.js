const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string from the .env file
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Exit the application with a failure code
    }
};

module.exports = connectDB;
