const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");
const notificationSchema = mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, require: true },
    to: { type: mongoose.Schema.Types.ObjectId, require: true },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    unread_flag: { type: Number, default: 0 }, //0=unread,1=read
    type: { type: Number, default: 1 }, //1=Offer, 2=Offer Accept, 3=Offer Rejected, 4=Review
  },
  { timestamps: true }
);
notificationSchema.plugin(aggregatePaginate);
notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Notification", notificationSchema);
