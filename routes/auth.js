const express = require("express");
const Router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");
const { verifytoken, verifyadmintoken } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });
const router = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
    // user.findById(obj, (err,user)=>{
    // })
  });
  ///user Routes

  Router.post("/login", auth.login);
  Router.post("/register/:path",upload.single("file"), auth.register);
  Router.post("/register",upload.single("file"), auth.register);

  


  Router.post("/emailVerify", auth.emailVerify);
  Router.post("/phoneVerify", auth.phoneVerify);

  Router.post("/forgotPassword", auth.forgotPassword);
  Router.post("/resetPassword", auth.resetPassword);
  Router.post("/updateProfile",upload.single("file"), verifytoken,auth.updateProfile);
  Router.get("/driverprofile",verifytoken, auth.getdriver)


  // Router.post("/signinwithgoogle", auth.googlelogin);
  //social login
  Router.get("/sociallogin", (req, res) => {
    res.render("../view/facebook.ejs");
  });
Router.get("/myprofile",verifytoken,auth.getprofile)
  //google
  Router.get(
    "/google",
    passport.authenticate("google", { scope: [ "email","profile"] })
  );

  Router.get(
    "/google/callback",

    passport.authenticate("google", {
      failureRedirect: "/error",
      successRedirect: "/success",
      session:false
    })
  );

  //facebook

  Router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: "email" })
  );
  Router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/success",
      failureRedirect: "/error",
    })
  );

  ///

  Router.post("/signinwithapple", auth.applelogin);
  Router.get("/users", auth.getUsers);

  ///Admin Routes
  Router.post("/adduser",verifyadmintoken,auth.adduser);
  Router.patch("/edituser",verifyadmintoken,auth.edituser);
  Router.patch("/status",verifyadmintoken,auth.userStatusUpdated);
  

  return Router;
};
module.exports = router();
