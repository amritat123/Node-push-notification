const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile_number: {
      type: String,
    },
    password: {
      type: String,
    },
    uid: {
      type: String,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    position: {
      type: { type: String },
      coordinates: [Number],
    },
    flag: {
      type: Number,
      default: 1, // 1=active, 2=deactivate 3 = deleted
    },
    email_notify: {
      type: Number,
      default: 1, // 1=enable, 2=disable
    },
    push_notification: {
      type: Number,
      default: 1, // 1=enable, 2=disable
    },
    language: {
      type: String,
      default: "en", // code = en, ic
    },
    selected_category: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    type: {
      type: Number, //1=email, 2=google, 3=facebook, 4=apple
      default: 1,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(aggregatePaginate);
UserSchema.plugin(mongoosePaginate);
// UserSchema.index({ position: "2dsphere" });
module.exports = mongoose.model("User", UserSchema);
