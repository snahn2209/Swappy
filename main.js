"use strict";

const port = 3000,
  express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  homeController = require("./controllers/homeController"),
  profileController = require("./controllers/profileController"),
  loginController = require("./controllers/loginController"),
  registerController = require("./controllers/registerController"),
  productController = require("./controllers/productController"),
  errorController = require("./controllers/errorController"),
  mongoose = require("mongoose"),
  expressEjsLayouts = require("express-ejs-layouts"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash");


//mongoose.connect("mongodb://91.58.14.60:27017", options);
mongoose.connect("mongodb://localhost:27017/swappyDB", { useNewUrlParser: true });

app.set("view engine", "ejs");

mongoose.Promise = global.Promise

app.use(
  express.urlencoded({
    extended: false,
  }),
  express.json(),
  expressEjsLayouts
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

app.use(homeController.logRequestData);

//to serve up static files in "public" folder
app.use("/public", express.static("public"));

//http://localhost:3000/?user=name
//optional query parameter for username
//depending on wether or not a user is logged in
app.get("/", homeController.sendHomePage);

//http://localhost:3000/login
app.get("/login", loginController.sendLoginPage);
app.post("/login", loginController.loginPost);

app.get("/logout", loginController.logout);

app.get("/register", registerController.sendRegisterPage);
app.post("/register", registerController.signUpPost);

app.get("/createProduct", productController.sendUploadProductPage);
app.post("/createProduct", productController.newProductPost);

//http://localhost:3000/product/646e21237dd2f2540d9f03aa
app.get("/product/:product_id", productController.getProductPage);

//http://localhost:3000/product/646e21237dd2f2540d9f03aa/edit
app.get("/product/:product_id/edit", productController.getEditProductForm);
//http://localhost:3000/product/64833822a3c654601d72823f/update?_method=PUT
app.put("/product/:product_id/update", productController.updateProduct);
app.get("/product/:product_id/delete", productController.deleteProduct);


//http://localhost:3000/profile
app.get("/profile", profileController.sendProfilePage);

//http://localhost:3000/profile/delete
app.get("/profile/delete", profileController.deleteUser);
app.get("/profile/update", profileController.getEditProfileForm);
app.put("/profile/update", profileController.updateProfile);

//error logging
app.use(
  errorController.logErrors,
  errorController.respondInternalError,
  errorController.respondNoResourceFound
);

app.listen(port, () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${port}`
  );
});
