const Mongoose = require("mongoose");

const userSchema = Mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
