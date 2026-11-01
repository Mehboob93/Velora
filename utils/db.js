const mongoose = require("mongoose");


module.exports = async function connectDB(url = process.env.ATLASDB_URL) {
    if (!url) {
        throw new Error(
            "ATLASDB_URL is not set. Add your MongoDB connection string to the .env file (see .env.example)."
        );
    }
    await mongoose.connect(url, { serverSelectionTimeoutMS: 15000 });
    return mongoose.connection;
};
