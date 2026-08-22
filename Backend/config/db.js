const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Use the same DNS servers that are working on your system
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
