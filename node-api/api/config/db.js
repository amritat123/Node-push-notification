const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log(`Db is connected successfully`);
  })
  .catch((err) => {
    console.log(`Error while connecting db ${err}`);
  });
exports = mongoose;
