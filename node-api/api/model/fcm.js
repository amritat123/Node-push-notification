const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const FCMDB = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
    },
    to: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
FCMDB.plugin(aggregatePaginate);
FCMDB.plugin(mongoosePaginate);

module.exports = mongoose.model("fcm", FCMDB);
