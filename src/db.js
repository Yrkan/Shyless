const mongoose = require("mongoose");
const config = require("config");

connectDB = async () => {
  try {
    const options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    await mongoose.connect(config.get("databaseURL"), options);
    console.log("Database connected sucessfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
