const sendGridApiKey = process.env.SEND_GRID_API_KEY;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(sendGridApiKey);
const HttpError = require("../model/http-error");

const template = (name, firstText, linkPath, secondText, linkText) => {
  return `<html>
  <head>
    <title>Forgot Password</title>
    <style>
      div{
        width:99.8%;
        margin:auto;
        text-align:center;
        border:1px solid #FF0055;
        font-family: Arial;
      }
      strong{
        color:yellow;
        font-size:2rem;
      }
      .link-cl{
        text-decoration:none;
        color: yellow;
        border: 2px solid white;
        display:block;
        text-align:center;
        margin:auto;
        padding:0.25rem;
        min-width: 3rem;
        max-width:40%;
        min-height:1rem;
      }
      .link-cl:hover{
        background:yellow;
        font-weight:bold;
        color:#FF0055;
        border-color: #FF0055;
      }
      h2, p{
        color:#FF0055;
      }
    </style>
  </head>
  <body>
    <div>
      <strong>Hello ${name}</strong>
      <p>${firstText}</p>
      <a href=${linkPath} class="link-cl">${linkText}</a>
      <h2>YourPlaces App</h2>
      <p><em>${secondText}</em></p>
    </div>
  </body>
</html>`;
};

const forgetPasswordEmail = async (name, email, link) => {
  const mailOptions = {
    to: email,
    from: "bsilakaymak@gmail.com",
    name: "YourPlaces",
    subject: "Password change request",
    html: template(
      name,
      `Please click on the following link to reset your password.`,
      link,
      ` If you did not request this, please ignore this email and your password will remain unchanged.`,
      `Click to Change Your Password`
    ),
    text: `Hello ${name} \n 
       Please click on the following link ${link} to reset your password. \n\n 
       If you did not request this, please ignore this email and your password will remain unchanged.\n`,
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
    html: template(
      name,
      `This is a confirmation that the password for your account ${email} has just been changed.`,
      `http://placesharer.herokuapp.com`,
      ` `,
      `Go to App`
    ),
    text: `Hello ${name} \n 
          This is a confirmation that the password for your account ${email} has just been changed.\n`,
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
    text: `Hello ${name} \n 
           ${person} wants to be your friend \n`,
    html: template(
      name,
      `${person} wants to be your friend`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
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
    html: template(
      name,
      `You are now friends with ${person}`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `Hello ${name} \n 
          You are now friends with ${person}\n`,
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
    html: template(
      name,
      `${person} liked your place ${place}`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person} liked your place ${place}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`,
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

const friendSharedPlace = async (friend, place, emails) => {
  const mailOptions = {
    to: emails,
    from: "bsilakaymak@gmail.com",
    name: "YourPlaces",
    subject: "Your friend shared a new place",
    html: template(
      `!`,
      `Your friend ${friend} shared a new place : ${place}`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `Hello! \n 
       Your friend ${friend} shared a new place : ${place} \n\n 
       If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`,
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
  likeNotification,
  friendSharedPlace
};
