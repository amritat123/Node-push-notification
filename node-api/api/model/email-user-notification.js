const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const EmailUserNotificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    email_notification_id: {
      type: mongoose.Types.ObjectId,
      ref: "email_notification",
    },
    status: { type: Number, default: 0 }, // 0 = not sent , 1 = sent
  },
  { timestamps: true }
);
EmailUserNotificationSchema.plugin(aggregatePaginate);
EmailUserNotificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "email_user_notification",
  EmailUserNotificationSchema
);
