const Mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await Mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Failed to connect to Database", error);
  }
};

module.exports = connectDB;
