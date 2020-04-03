const path = require("path");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");

const connectDB = require("./model/db");
const HttpError = require("./model/http-error");
const userRoute = require("./routes/user-route");
const usersRoute = require("./routes/users-route");
const placesRoute = require("./routes/places-route");
const searchRoute = require("./routes/search-route");
const passportSetup = require("./middleware/passport-setup");

const PORT = process.env.PORT || 5000;

const app = express();

// connect the database
connectDB();

app.use(bodyParser.json());

app.use(express.static("frontend/build"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  next();
});

app.use(passport.initialize());
app.use("/api/places", placesRoute);
app.use("/api/users", usersRoute);
app.use("/api/user", userRoute);
app.use("/api/search", searchRoute);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// Here I check if the user use a wrong path
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

// error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unKnown error occurred!" });
});

// Connect the express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
