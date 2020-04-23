const sgMail = require("@sendgrid/mail");
const HttpError = require("../model/http-error");
const sendGridApiKey = process.env.SEND_GRID_API_KEY;

sgMail.setApiKey(sendGridApiKey);

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
        max-width:30%;
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
      <p>${secondText}</p>
    </div>
  </body>
</html>`;
};

const accountVerifyEmail = async (name, email, link) => {
  const mailGenerator = {
    to: email,
    from: "yourplaces.hyf@gmail.com",
    subject: "Confirm your Account",
    html: template(
      name,
      `Congratulations! You're almost set to start using YourPlaces
    Just click the link below to validate your email address.`,
      link,
      `Verifying your email ensures that you can access and manage your account, and receive critical notifications.
    Note: You must perform this validation within one hour to keep your new account enabled, otherwise you need to sign up once again`,
      `Confirm`
    ),
    text: `Hello ${name} \n 
      Congratulations! You're almost set to start using YourPlaces.\n
      Just click the link below to validate your email address. \n\n
        ${link} \n\n
      Verifying your email ensures that you can access and manage your account, and receive critical notifications.\n\n
      Note: You must perform this validation within one hour to keep your new account enabled, otherwise you need to sign up once again\n`,
  };
  try {
    await sgMail.send(mailGenerator);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};
const accountActivatedEmail = async (name, email) => {
  const mailGenerator = {
    to: email,
    from: "yourplaces.hyf@gmail.com",
    subject: "Confirmation",
    html: template(
      name,
      `Your account ${email} has been activated successfully.You may now log in and begin using it.`,
      `https://placesharer.herokuapp.com`,
      ` `,
      `Go to App`
    ),
    text: `Thanks ${name} \n 
          Your account ${email} has been activated successfully.\n
          You may now log in and begin using it.\n`,
  };
  try {
    await sgMail.send(mailGenerator);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

module.exports = { accountVerifyEmail, accountActivatedEmail };
