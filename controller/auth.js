const authentication = require("../models/auth")
const { loginSchema, registerSchema } = require('../middleware/validationSchema')
var bcrypt = require('bcryptjs');
const { tokengenerate } = require('../middleware/auth')
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, store_link, password } = req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(first_name && last_name && email && phone && store_link && password)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else if (!re.test(email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    } else {
      await registerSchema.validateAsync(req.body)
      authentication.findOne({ email: email }, async (err, data) => {
        if (data) {
          res.status(400).json({
            message: "User already registered",
            success: false,
          })
        } else {

          if (!["admin", "buyer", "shopper"].includes(req.body.user_type)) {
            res.status(400).json({
              message: "Invalid User Type",
              success: false,
            })

          } else if (!(req.body.is_email_verify &&
            req.body.is_phone_verify)) {
            res.status(400).json({
              message: req.body.is_email_verify ? "Unverified Phone Number" : " Unverified Email",
              success: false,
            })

          } else {
            var salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
            const Authentication = new authentication(req.body);
            Authentication.save().then((item) => {
              item.password = ""
              res.status(200).send({
                message: "Data save into Database",
                data: item,
                token: tokengenerate({ user: item }),
                success: true,
              });
            });
          }
        }
      });
    }
  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!(email && password)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    }
    await loginSchema.validateAsync(req.body)
    authentication.findOne({ email: email }, (err, result) => {
      if (!result) {
        res
          .status(200)
          .send({ message: "User not Exist", success: false });
      } else {

        if (bcrypt.compareSync(password, result.password)) {
          result.password = ''
          res
            .status(200)
            .send({ message: "Login Successfull", success: true, token: tokengenerate(result), data: result });
        } else {
          res
            .status(200)
            .send({ message: "Password invalid", success: false });
        }
      }
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try { } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
const nodemailer = require("nodemailer");
const auth = require("../models/auth");
exports.emailVerify = async (req, res) => {
  try {
    
    const { email, otp } = req.body
    if (otp) {
      authentication.findOne({ email: email, e_otp: otp, is_email_verify: false }, async (err, result) => {
        if (result) {
          authentication.updateOne({ email: email, e_otp: otp }, { is_email_verify: true }, async (err, result) => {
            if (result) {
              res.status(200).send({
                message: "Email Verified Successfully",
                success: false,
              });
            } else {
              res.status(200).send({
                message: "Invalid email or OTP",
                success: false,
              });
            }
          })
        } else {
          res.status(200).send({
            message: "Invalid email or OTP",
            success: false,
          });
        }
      })
    } else {
     
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }


      authentication.findOne({ email: email }, async (err, result) => {
        if (result?.is_email_verify) {
          res.status(200).send({
            message: "Email already verified",
            success: false,
          });
        } else {
          
          nodemailer.createTestAccount(async (err, account) => {
            // create reusable transporter object using the default SMTP transport
            // let transporter = nodemailer.createTransport({
            //     host: 'smtp.ethereal.email',
            //     port: 587,
            //     secure: false, // true for 465, false for other ports
            //     auth: {
            //         user: account.user, // generated ethereal user
            //         pass: account.pass  // generated ethereal password
            //     }
            // });

            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                
                user: "mmmmkhatri123@gmail.com",
                pass:"03142059628"
              },
            });

            let info = await transporter.sendMail({
              // from: account.user,
              from: "mmmmkhatri123@gmail.com",
              to: email, // list of receivers
              subject: "OTP verification", // Subject line
  
              html: "<h1> otp for verification is :" + OTP + "</h1>", // html body
            });
            console.log(info);
            if (!result?.is_email_verify) {
              
              authentication.updateOne({ email: email }, { e_otp: OTP }, async (err, result) => {
                if (result) {
                  res.status(200).send({
                    message: "OTP send to your email address",
                    success: true,
                  });
                }
              })
            } else {
              console.log("/");
              const Authentication = new authentication({
                email: email,
                e_otp: OTP,
                is_email_verify: false
              })
              Authentication.save().then((item) => {
  
                res.status(200).send({
                  message: "OTP send to your email address",
  
                  success: true,
                });
              });
            }
        });
          // let testAccount = await nodemailer.createTestAccount();

          // let transporter = nodemailer.createTransport({
          //   host: "smtp.ethereal.email",
          //   secure: false,
          //   port: 587,
          //   auth: {
          //     user: testAccount.user, // generated ethereal user
          //     pass: testAccount.pass, // generated ethereal password
          //   },
          // });

          
        }
      })
    }


  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}


exports.phoneVerify = async (req, res) => {
  try {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }



  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

exports.forgotPassword = async (req, res) => {
  try { } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
exports.resetPassword = async (req, res) => {
  try { } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

exports.googlelogin = async (req, res) => {
  try {


  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
