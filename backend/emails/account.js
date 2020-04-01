const sendGridApiKey = process.env.SEND_GRID_API_KEY
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(sendGridApiKey);
const HttpError = require('../model/http-error')

const forgetPasswordEmail = async (name, email, link) => {
  const mailOptions = {
    to: email,
    from: "bsilakaymak@gmail.com",
    subject: "Password change request",
    text: `Hi ${name} \n 
       Please click on the following link ${link} to reset your password. \n\n 
       If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

const resetPasswordEmail = async (name, email) => {
  const mailOptions = {
    to: email,
    from: "bsilakaymak@gmail.com",
    subject: "Your password has been changed",
    text: `Hi ${name} \n 
          This is a confirmation that the password for your account ${email} has just been changed.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};



const friendAddedNotification = async (name, person, email) => {
  const mailOptions = {
    to: email,
    from: "yourplaces.hyf@gmail.com",
    subject: "You have a new friend request",
    text: `Hi ${name} \n 
           ${person} wants to be your friend \n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

const friendAcceptedNotification = async (name, person, email) => {
  const mailOptions = {
    to: email,
    from: "yourplaces.hyf@gmail.com",
    subject: "Your friend request is accepted",
    text: `Hi ${name} \n 
          You are now friends with ${person}\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

const likeNotification = async (name, person, place, email) => {
  const mailOptions = {
    to: email,
    from: "bsilakaymak@gmail.com",
    subject: "Someone liked your place",
    text: `   Hi ${name}, 
    ${person} liked your place ${place}
    If you no longer want to receive notifications, you can turn them off in your profile page\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};


module.exports = {
  forgetPasswordEmail,
  resetPasswordEmail,
  friendAddedNotification,
  friendAcceptedNotification,
  likeNotification
};
