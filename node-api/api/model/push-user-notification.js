const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const PushNotificationSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    push_notification_id: {
      type: mongoose.Types.ObjectId,
      ref: "push_notification",
    },
  },
  { timestamps: true }
);
PushNotificationSchema.plugin(aggregatePaginate);
PushNotificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("push_notification", PushNotificationSchema);
