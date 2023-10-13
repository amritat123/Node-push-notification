const mongoose = require("mongoose");
const niv = require("node-input-validator");
const EmailUserNotificationModel = require("../model/email-user-notification");
const EmailNotificationModel = require("../model/email-notification");

exports.EmailNotification = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    subject: "required",
    email_body: "required",
    user_id: "required",
  });
  const matched = await objValidation.check();

  if (!matched) {
    return res
      .status(422)
      .send({ message: "Validation error", errors: objValidation.errors });
  }

  try {
    const { subject, email_body, user_id } = req.body;

    // Create a new email notification
    const emailNotification = new EmailNotificationModel({
      subject: subject,
      email_body: email_body,
    });

    // Save the email notification to the database
    const savedUserNotification = await emailNotification.save();

    for (i = 0; i < user_id.length; i++) {
      let user = user_id[i];

      const emailUserNotification = new EmailUserNotificationModel({
        user_id: user,
        email_notification_id: savedUserNotification._id,
      });
      await emailUserNotification.save();
    }

    res.status(200).send({
      message: "Email notification inserted successfully",
      result: {},
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

// Get all email notification records
exports.getEmailNotification = async (req, res) => {
  let { page, limit } = req.query;

  if ([1, "", 0, undefined, null, "undefined", "null"].includes(page)) {
    page = 1;
  }
  if ([1, "", 0, undefined, null].includes(limit)) {
    limit = 10;
  }
  let options = {
    page: page,
    limit: limit,
  };
  try {
    const emailNotificationAggregate = EmailNotificationModel.aggregate([
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $project: {
          subject: 1,
          email_body: 1,
        },
      },
    ]);
    const result = await EmailNotificationModel.aggregatePaginate(
      emailNotificationAggregate,
      options
    );
    return res.status(200).send({
      message: "fetched all email notification record",
      success: true,
      Result: result,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.cronEmail = async (req, res) => {
  const matchObj = {};
  matchObj.status = 0;
  try {
    const result = await EmailUserNotificationModel.aggregate([
      {
        $match: {
          matchObj,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "email_notifications",
          localField: "email_notification_id",
          foreignField: "_id",
          as: "email_notification_data",
        },
      },
      {
        $unwind: {
          path: "$email_notification_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id",
        },
      },
      {
        $unwind: {
          path: "$user_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          user_id: { email: 1 },
          email_notification_data: { subject: 1, email_body: 1 },
        },
      },
    ]);
    // let count;
    // if (notifications.length > 0) {
    //     for (let i = 0; i < notifications.length; i++) {
    //       const element = notifications[i];
    //       let status = 1;
    //       count = i + 1;
    //     }
    // }
    return res.status(200).send({
      message: "Successfully data fetched",
      Result: result,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
