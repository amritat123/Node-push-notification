const NotificationDB = require("../model/notification");
// const sizeOf = require("image-size");
const moment = require("moment");
// const Jimp = require("jimp");
const fs = require("fs");
// const { promisify } = require("util");
// const convert = require("heic-convert");
// const admin = require("firebase-admin");

exports.generateRandomString = (length, isNumber = false) => {
  var result = "";
  if (isNumber) {
    var characters = "0123456789";
  } else {
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  z;
};

exports.getCategoryType = (type) => {
  if (type === 1) {
    return "Event";
  } else if (type === 2) {
    return "Business";
  }
  return "";
};

exports.getNotificationText = async (type) => {
  let text = "";
  if (type === 1) {
    text = "Sent you a friend request";
  } else if (type === 2) {
    text = "Started follow you";
  } else if (type === 3) {
    text = "accepted your friend request";
  }
  return text;
};

exports.uploadFileInS3 = async (folderName, file) => {
  // console.log(file);
  return new Promise(async function (resolve, reject) {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;

    params.Key =
      folderName + exports.generateRandomString(6) + "_" + file.originalname;
    params.Body = file.buffer;
    await s3Client.upload(params, async (err, data) => {
      if (err) {
        // return false;
        reject(err);
      } else {
        resolve(data);
      }
      // return true;
    });
  });
};

exports.getValidImageUrl = async (filename, name = "SH") => {
  console.log(true);
  if (filename === "" || filename === undefined || filename === null) {
    filename =
      "https://ui-avatars.com/api/?name=" +
      name +
      "&rounded=true&background=c39a56&color=fff&format=png";
  } else {
    filename = process.env.URL + "uploads/" + filename;
  }
  return filename;
};

exports.getImageUrl = async (filename, name = "SH") => {
  if (filename === "" || filename === undefined || filename === null) {
    filename =
      "https://ui-avatars.com/api/?name=" +
      name +
      "&rounded=true&background=c39a56&color=fff&format=png";
  } else {
    filename = process.env.URL + filename;
  }
  return filename;
};

exports.writeErrorLog = async (req, error) => {
  const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
  const requestBody = JSON.stringify(req.body);
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  fs.appendFileSync(
    "errorLog.log",
    "REQUEST DATE : " +
      date +
      "\n" +
      "API URL : " +
      requestURL +
      "\n" +
      "API PARAMETER : " +
      requestBody +
      "\n" +
      "Error : " +
      error +
      "\n\n"
  );
};

exports.getSlugName = (title) => {
  const titleLOwerCase = title.toLowerCase();
  const slug = titleLOwerCase.replace(/ /g, "-");
  return slug;
};

//
exports.businessStatus = async (data) => {
  let result = "close";
  if (parseInt(data) === 1) {
    result = "open";
  }
  return result;
};
exports.replaceCountryCode = async (mobile_number) => {
  if (mobile_number.includes("+")) {
    return mobile_number.replace(/[|&;$%@"<>()+,]/g, "");
  }
  // if (pattern.test(mobile_number)) {
  //   return mobile_number.replace(/[|&;$%@"<>()+,]/g, '')
  // }
};

//
exports.getValidImageUrl = async (filename, name = "SH") => {
  filename = process.env.URL + filename;
  return filename.replace(/\\/g, "/");
};

exports.addNotification = async (from, to, title, text, type) => {
  const newNotificationObj = new NotificationDB({
    from,
    to,
    title,
    text,
    type,
  });
  const result = await newNotificationObj.save();
  return result;
};

exports.toCapitalize = (str) => {
  let first = str.charAt(0);
  first = first.toUpperCase();

  let remaining = str.slice(1);
  remaining = remaining.toLowerCase();

  return first + remaining;
};

const heicToJpg = async (path) => {
  console.time("HEIC read time");
  const inputBuffer = await promisify(fs.readFile)(path);
  console.timeEnd("HEIC read time");
  console.time("Conversion Time");
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: "JPEG", // output format
    quality: 0.1, // the jpeg compression quality, between 0 and 1
  });

  op_path = path.split(".")[0] + ".jpg";

  await promisify(fs.writeFile)(op_path, outputBuffer);
  console.timeEnd("Conversion Time");
  console.log("HEIC converted");
  console.time("Deletion Time");
  fs.unlink(path, function (err) {
    if (err) throw err;
    console.log("HEIC deleted");
  });
  console.timeEnd("Deletion Time");
  return op_path;
};

exports.resizeImage = async (path) => {
  try {
    if (!path.match(/\.(jpe?g|png|gif|heic)$/gi)) return;
    if (path.match(/\.(heic)$/gi)) {
      path = await heicToJpg(path);
    }
    console.log(path);
    console.time("JPG Compression Time");
    let imageDimensions = sizeOf(path);
    if (imageDimensions.width > 600) {
      Jimp.read(path).then((res) => {
        result = res
          .resize(600, Jimp.AUTO) // width height
          .quality(50) // set JPEG quality
          .write(path);
      });
      console.timeEnd("JPG Compression Time");
    }
    return path;
  } catch (err) {
    console.log(err);
  }
};
exports.call_msg_notification = async (registration_ids, messages) => {
  const message = {
    notification: {
      title: messages.title,
      body: messages.body,
    },
    tokens: registration_ids,
    data: {
      title: messages.title,
      body: messages.body,
      notification_type: String(messages.type),
      id: String(messages.id),
      shipType: messages.shipType ? String(messages.shipType) : "",
      chat_id: messages.chat_id ? String(messages.chat_id) : "",
      click_action: "NODE_NOTIFICATION_CLICK",
    },
  };
  // console.log(message)
  admin
    .messaging()
    .sendMulticast(message)
    .then(async (result) => {
      console.log(result);
    })
    .catch(async (err) => {
      console.log(err);
    });
};

exports.call_msg_ios_notification = async (registration_ids, messages) => {
  const message = {
    notification: {
      title: messages.title,
      body: messages.body,
    },
    tokens: registration_ids,
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: Number(messages.bedge),
        },
      },
    },
    data: {
      type: String(messages.type),
      chat_id: messages.chat_id ? String(messages.chat_id) : "",
    },
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then(async (result) => {
      console.log(result);
    })
    .catch(async (err) => {
      console.log(err);
    });
};

exports.homeReqLog = async (req, status) => {
  try {
    const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    const requestBody = JSON.stringify(req.body);
    const requestParams = JSON.stringify(req.query);
    const date = moment().format("MMMM Do YYYY, h:mm:ss a");
    const token = req.headers.authorization.split(" ")[1];
    fs.appendFileSync(
      "home.log",
      "REQUEST DATE : " +
        date +
        "\n" +
        "API URL : " +
        requestURL +
        "\n" +
        "API PARAMETER : " +
        requestBody +
        "\n" +
        "QUERY PARAMS : " +
        requestParams +
        "\n" +
        "STATUS : " +
        status +
        "TOKEN : " +
        token +
        "\n" +
        "\n\n"
    );
  } catch (err) {
    console.log("err", err);
  }
};
