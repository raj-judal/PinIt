const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const pinRoutes = require("./routes/pinRoutes");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require('body-parser');
app.use(cors({ origin: "http://localhost:3000" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});
dotenv.config();
app.use(bodyParser.json());
connectDB();
app.use(express.json());
app.use("/api/v1/pins", pinRoutes);
app.use("/api/v1/user", userRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server Started On port ${process.env.PORT}`);
});