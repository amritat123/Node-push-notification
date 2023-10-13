const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const EmailNotificationSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      default: "",
    },
    email_body: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
EmailNotificationSchema.plugin(aggregatePaginate);
EmailNotificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("email_notification", EmailNotificationSchema);
