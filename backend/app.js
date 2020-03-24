const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const placesRoute = require('./routes/places-route');
const usersRoute = require('./routes/users-route');
const friendsRoutes = require("./routes/friend-route");
const HttpError = require('./model/http-error');
const connectDB = require('./config/db');
const app = express();
const port = process.env.PORT || 5000;
// connect the database
connectDB();

app.use(bodyParser.json());

app.use(express.static(path.join('public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  // for accept request we added PUT
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
  next();
});

app.use('/api/places', placesRoute);
app.use('/api/users', usersRoute);
app.use("/api/friends", friendsRoutes);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// error handling middleware
// In case of 4 arguments are existed, then express will recognize it as error handling
// This code will be executed every time getting error
app.use((error, req, res, next) => {

  if (res.headerSent) {
    return next(error);
  }

  // If the error does not has code property then return error 500
  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred! " });
});
// Connect the express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
