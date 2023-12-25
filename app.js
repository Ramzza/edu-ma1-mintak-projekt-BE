const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const mySession = require("./session/mysession");
require("dotenv/config");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(sessions(mySession.getConfig()));
app.use(
  sessions({
    secret: "MY_SECRET_KEY_asdfghjkl",
    saveUninitialized: true,
    cookie: { maxAge: 120000 },
    resave: false,
  })
);

// Import Routes
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const tasksRoute = require("./routes/tasks");
const session = require("express-session");

// Route middlewares
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/tasks", tasksRoute);

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (e) => {
    console.log(e);
    console.log("connected to DB!");
  }
);

// mongoose.disconnect();

// How do we start listening to the server
app.listen(3001);
