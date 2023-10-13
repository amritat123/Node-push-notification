const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const PushUserNotificationSchema = mongoose.Schema(
  {
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
PushUserNotificationSchema.plugin(aggregatePaginate);
PushUserNotificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "push_user_notification",
  PushUserNotificationSchema
);
