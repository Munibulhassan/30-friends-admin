const express = require('express')
const Router = express.Router()
const auth = require('../controller/auth')
const router = ()=>{

    Router.post('/login', auth.login)    
    Router.post('/register', auth.register)
    Router.post('/emailVerify', auth.emailVerify)
    Router.post('/phoneVerify', auth.phoneVerify)
    Router.post('/forgotPassword', auth.forgotPassword)
    Router.post('/resetPassword', auth.resetPassword)
    Router.post('/updateProfile', auth.updateProfile)

    Router.post('/signinwithgoogle', auth.googlelogin)    
    return Router;
}
module.exports =  router()