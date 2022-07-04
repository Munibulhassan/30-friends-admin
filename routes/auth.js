const express = require('express')
const Router = express.Router()
const auth = require('../controller/auth')
const user = require("../models/auth")
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    user.findOrCreate({userId:profile.id, first_name:profile.displayName},(err,userProfile)=>{

        return done(null, userProfile);
    })
    
}
));
const router = ()=>{

    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
      });
      
      passport.deserializeUser(function(obj, cb) {
          cb(null, obj);
        // user.findById(obj, (err,user)=>{
        // })
      });
    ///user Routes

    Router.post('/login', auth.login)    
    Router.post('/register', auth.register)
    
    Router.post('/emailVerify', auth.emailVerify)
    Router.post('/phoneVerify', auth.phoneVerify)

    Router.post('/forgotPassword', auth.forgotPassword)
    Router.post('/resetPassword', auth.resetPassword)
    Router.post('/updateProfile', auth.updateProfile)

    Router.post('/signinwithgoogle', auth.googlelogin)    
    Router.post('/signinwithfacebook', auth.facbooklogin)    
    Router.post('/signinwithfacebook', auth.applelogin)    
 
    Router.get('/google', 
    passport.authenticate('google', { scope : ['profile', 'email'] }));
   
    Router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
        
      // Successful authentication, redirect success.
      res.redirect('/api/auth/register');
    });

    ///Admin Routes
    Router.post("/adduser")
    Router.patch("/edituser")
    Router.post("/approveuser")
    Router.delete("/deleteuser")






    return Router;
}
module.exports =  router()