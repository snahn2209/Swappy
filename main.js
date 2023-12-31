"use strict";

const port = 3000,
  express = require("express"),
  router = require("./routes/index"),
  passport = require("passport"),
  mongoose = require("mongoose"),
  expressEjsLayouts = require("express-ejs-layouts"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  app = express();

mongoose.connect("mongodb://localhost:27017/swappyDB", { useNewUrlParser: true });

app.set("view engine", "ejs");
//to serve up static files in "public" folder
app.use("/public", express.static("public"));

mongoose.Promise = global.Promise

app.use(
  express.urlencoded({
    extended: false,
  }),
  express.json(),
  expressEjsLayouts,
);

app.use(cookieParser("secret_passcode"))
app.use(expressSession({
  secret: "swappy_secret",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}))
app.use(connectFlash())
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", router);

const server = app.listen(port, () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${port}`);
}),
  io = require("socket.io")(server);
require("./controllers/chatController.js")(io);
