const cron = require("node-cron");
const helperEmail = require("./helper/email");
const Helper = require("./helper/index");
const FCMDB = require("./model/fcm");
const mongoose = require("mongoose");

const EmailUserNotificationModel = require("./model/email-user-notification");
const PushUserNotificationModel = require("./model/push-user-notification");

// Send email user notification
// cron.schedule("", async () => {
//   console.log("Start Email");
//   const matchObj = {};
//   matchObj.status = 0;
//   try {
//     const result = await EmailUserNotificationModel.aggregate([
//       {
//         $match: matchObj,
//       },
//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//       {
//         $lookup: {
//           from: "email_notifications",
//           localField: "email_notification_id",
//           foreignField: "_id",
//           as: "email_notification_data",
//         },
//       },
//       {
//         $unwind: {
//           path: "$email_notification_data",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "users",
//         },
//       },
//       {
//         $unwind: {
//           path: "$users",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           users: { email: 1 },
//           email_notification_data: { subject: 1, email_body: 1 },
//         },
//       },
//     ]);
//     for (let i = 0; i < result?.length; i++) {
//       const element = result[i];
//       await helperEmail.SendMail(
//         element.users.email,
//         element.email_notification_data.subject,
//         element.email_notification_data.email_body,
//         3,
//         "en"
//       );
//       0;
//       await EmailUserNotificationModel.updateOne(
//         { _id: element._id },
//         { $set: { status: 1 } }
//       );
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// Send push user notification
// cron.schedule("", async () => {
//   console.log("Start");
//   const matchObj = {};
//   matchObj.status = 0;
//   try {
//     const result = await PushUserNotificationModel.aggregate([
//       {
//         $match: matchObj,
//       },
//       {
//         $sort: {
//           createdAt: -1,
//         },
//       },
//       {
//         $lookup: {
//           from: "push_notifications",
//           localField: "push_notification_id",
//           foreignField: "_id",
//           as: "push_notification_data",
//         },
//       },
//       {
//         $unwind: {
//           path: "$push_notification_data",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $project: {
//           user_id: 1,
//           push_notification_data: 1,
//         },
//       },
//     ]);
//     // ----push user notification-----
//     const title = "Message from site";
//     // Static user_id = "621388de85d6ad29020b6f25"
//     for (let i = 0; i < result?.length; i++) {
//       const element = result[i];
//       await sendPushNotification(
//         element.user_id,
//         title,
//         element.push_notification_data.message,
//         8
//       );

//       //  Update status to 1 after receiving notification.
//       await PushUserNotificationModel.updateOne(
//         { _id: element._id },
//         { $set: { status: 1 } }
//       );
//     }
//   } catch (err) {
//     console.log("err", err);
//   }
// });

sendPushNotification = async (to, title, body, type) => {
  let checkObj = {};
  checkObj.user = mongoose.Types.ObjectId(to);
  let messageObject = {};
  messageObject.type = type;
  messageObject.title = title;
  messageObject.body = body;

  const userTokens = await FCMDB.find({ user: to });
  const android_list = new Array();
  const ios_list = new Array();
  userTokens.map((userToken) => {
    if (userToken.type == 1) {
      android_list.push(userToken.token);
    }
    if (userToken.type == 2) {
      ios_list.push(userToken.token);
    }
  });
  android_list.map(async (android_lists) => {
    const registration_id = new Array();
    registration_id.push(android_lists);
    await Helper.call_msg_notification(registration_id, messageObject);
  });
  ios_list.map(async (ios_lists) => {
    const registration_id = new Array();
    registration_id.push(ios_lists);
    await Helper.call_msg_ios_notification(registration_id, messageObject);
  });
};
