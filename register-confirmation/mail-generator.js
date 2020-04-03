const sgMail = require('@sendgrid/mail');
const HttpError = require('../model/http-error')
const sendGridApiKey = process.env.SEND_GRID_API_KEY

sgMail.setApiKey(sendGridApiKey);

const accountVerifyEmail = async (name, email, link) => {
  const mailGenerator  = {
    to: email,
    from: "yourplaces.hyf@gmail.com",
    subject: "Confirm your Account",
    text: `Hi ${name} \n 
      Congratulations! You're almost set to start using YourPlaces.\n
      Just click the link below to validate your email address. \n\n
        ${link} \n\n
      Verifying your email ensures that you can access and manage your account, and receive critical notifications.\n\n
      Note: You must perform this validation within one hour to keep your new account enabled, otherwise you need to sign up once again\n`
  };
  try {
    await sgMail.send(mailGenerator );
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};
const accountActivatedEmail = async (name, email) => {
  const mailGenerator  = {
    to: email,
    from: "yourplaces.hyf@gmail.com",
    subject: "Confirmation",
    text: `Thanks ${name} \n 
          Your account ${email} has been activated successfully.\n
          You may now log in and begin using it.\n`
  };
  try {
    await sgMail.send(mailGenerator );
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

module.exports = { accountVerifyEmail, accountActivatedEmail }