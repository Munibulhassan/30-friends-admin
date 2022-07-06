const express = require("express");
const Router = express.Router();
const auth = require("../controller/auth");
const user = require("../models/auth");
const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth2").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback : true
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile)
      user.findOne({ googleId: profile?.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          var result = "";
          var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          var charactersLength = characters.length;
          for (var i = 0; i < 5; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }

          new user({
            googleId: profile.id,
            first_name: profile.displayName.split(" ")[0],
            last_name: profile.displayName.split(" ")[1],
            email: profile.emails[0].value,
            provider: "google",
            own_ref_code: result,
          })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);

///facebook

const facebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new facebookStrategy(
    {
      // pull in our app id and secret from our auth.js file
      clientID: "449162086686306",
      clientSecret: "cfea9f4c3cc78abdc08c51ae9a6e2982",
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    }, // facebook will send back the token and profile
    function (token, refreshToken, profile, done) {
      if (profile.emails === undefined) {
        done('email-required')
        return;
    }
      console.log(profile);
      // console.log(token);



      // user.findOne({ facebookId: profile.id }).then((existingUser) => {
      //   if (existingUser) {
      //     return done(null, profile);
      //   } else {
      //     var result = "";
      //     var characters =
      //       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      //     var charactersLength = characters.length;
      //     for (var i = 0; i < 5; i++) {
      //       result += characters.charAt(
      //         Math.floor(Math.random() * charactersLength)
      //       );
      //     }

      //     new user({
      //       facebookId: profile.id,
      //       first_name: profile?.displayName?.split(" ")[0],
      //       last_name: profile?.displayName?.split(" ")[1],
      //       email: profile?.emails ? profile?.emails[0]?.value: "",
      //       provider: "facebook",
      //       own_ref_code: result,
      //     })
      //       .save()
      //       .then((user) => done(null, user));
      //   }
      // });
    }
  )
);
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
  Router.post("/register", auth.register);

  Router.post("/emailVerify", auth.emailVerify);
  Router.post("/phoneVerify", auth.phoneVerify);

  Router.post("/forgotPassword", auth.forgotPassword);
  Router.post("/resetPassword", auth.resetPassword);
  Router.post("/updateProfile", auth.updateProfile);

  // Router.post("/signinwithgoogle", auth.googlelogin);
  //social login
  Router.get("/sociallogin", (req, res) => {
    res.render("../view/facebook.ejs");
  });

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

  Router.post("/signinwithfacebook", auth.applelogin);
  Router.get("/users", auth.getUsers);

  ///Admin Routes
  Router.post("/adduser");
  Router.patch("/edituser");
  Router.post("/approveuser");
  Router.delete("/deleteuser");

  return Router;
};
module.exports = router();
