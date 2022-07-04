const authentication = require("../models/auth");
const {
  loginSchema,
  registerSchema,
} = require("../middleware/validationSchema");
var bcrypt = require("bcryptjs");
const { tokengenerate } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const { Auth } = require("two-step-auth");
const twilio = require("twilio");
const client = new twilio(process.env.accountSid, process.env.authToken);

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, city, state, password } =
      req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      !(first_name && last_name && email && phone && city && state && password)
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else if (!re.test(email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    } else {
      await registerSchema.validateAsync(req.body);
      authentication.findOne({ email: email }, async (err, data) => {
        if (data) {
          req.body.email = email;
          req.body.phone = data.phone;
          var salt = bcrypt.genSaltSync(10);
          req.body.password = bcrypt.hashSync(req.body.password, salt);
          authentication.updateOne({ email }, req.body, (err, result) => {
            res.status(200).json({
              message: "User Register Successfully",
              success: true,
            });
          });
        } else {
          var salt = bcrypt.genSaltSync(10);
          req.body.password = bcrypt.hashSync(req.body.password, salt);
          const Authentication = new authentication(req.body);
          Authentication.save().then((item) => {
            item.password = "";
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              token: tokengenerate({ user: item }),
              success: true,
            });
          });
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
    const { email, password } = req.body;
    if (!(email && password)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    }
    await loginSchema.validateAsync(req.body);
    authentication.findOne({ email: email }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "User not Exist", success: false });
      } else {
        if (!result.password) {
          res.status(200).send({
            message: "first register yourseld",
            success: false,
          });
        } else if (bcrypt.compareSync(password, result.password)) {
          result.password = "";
          res.status(200).send({
            message: "Login Successfull",
            success: true,
            token: tokengenerate(result),
            data: result,
          });
        } else {
          res.status(200).send({ message: "Password invalid", success: false });
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      authentication.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No USer Exist", success: false });
        } else {
          // if (req.file) {
          //   await unlinkAsync(`uploads/category/` + result.image);

          //   req.body.image = req.file.filename;
          // }
          authentication.updateOne({ _id: id }, req.body, (err, result) => {
            if (err) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "User updated Successfully",
                success: true,
                data: result,
              });
            }
          });
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
exports.emailVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (otp) {
      authentication.findOne(
        { email: email, e_otp: otp, is_email_verify: false },
        async (err, result) => {
          if (result) {
            authentication.updateOne(
              { email: email },
              { is_email_verify: true, e_otp: 0 },
              async (err, result) => {
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
              }
            );
          } else {
            res.status(200).send({
              message: "Invalid email or OTP",
              success: false,
            });
          }
        }
      );
    } else {
      let OTP = Math.floor(1000 + Math.random() * 9000);

      // const MAIL_SETTINGS= {
      //   service: 'gmail',
      //   auth: {
      //     user: process.env.email,
      //     pass: process.env.password,
      //   },
      // },
      // const transporter = nodemailer.createTransport(MAIL_SETTINGS);

      authentication.findOne({ email: email }, async (err, result) => {
        if (result?.is_email_verify) {
          res.status(200).send({
            message: "Email already verified",
            success: false,
          });
        } else {
          
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

exports.phoneVerify = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    let OTP = Math.floor(1000 + Math.random() * 9000);
    if (otp) {
      authentication.findOne({ email, phone }, (err, result) => {
        if (!result) {
          res.status(200).send({
            message: "Invalid phone or token",
            success: false,
          });
        } else {
          if (result.is_phone_verify == true && result.phone == phone) {
            res.status(200).send({
              message: "Phone is already verify",
              success: false,
            });
          } else {
            authentication.updateOne(
              { email, phone },
              { is_phone_verify: true, p_otp: 0 },
              (err, val) => {
                res.status(200).send({
                  message: "Phone is verified successfully",
                  success: true,
                });
              }
            );
          }
        }
      });
    } else {
      authentication.findOne({ email }, (err, result) => {
        if (!result) {
          const Authentication = new authentication({
            email: email,
            phone: phone,
            is_phone_verify: false,
            p_otp: OTP,
          });
          Authentication.save().then((item) => {
            client.messages
              .create({
                body: `Your Verification OTP is ${OTP}`,
                to: req.body.phone, // Text this number
                from: process.env.phone, // From a valid Twilio number
              })
              .then((message) =>
                res.status(200).send({
                  message: "OTP send to " + phone,
                  success: true,
                })
              );
          });
        } else {
          if (result.is_phone_verify == true && result.phone == phone) {
            res.status(200).send({
              message: "Phone is already verify",
              success: false,
            });
          } else if (result.phone != phone) {
            res.status(200).send({
              message: "You are trying with another phone no",
              success: false,
            });
          } else {
            authentication.updateOne({ email }, { p_otp: OTP }, (err, val) => {
              client.messages
                .create({
                  body: `Your Verification OTP is ${OTP}`,
                  to: req.body.phone, // Text this number
                  from: process.env.phone, // From a valid Twilio number
                })
                .then((message) =>
                  res.status(200).send({
                    message: "OTP send to " + phone,
                    success: true,
                  })
                )
                .done();
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
//done
exports.forgotPassword = async (req, res) => {
  try {
    const { otp, phone } = req.body;
    let OTP = Math.floor(1000 + Math.random() * 9000);

    authentication.findOne({ phone: req.body.phone }, (err, result) => {
      if (result) {
        client.messages
          .create({
            body: `Your Verification OTP is ${OTP}`,
            to: req.body.phone, // Text this number
            from: process.env.phone, // From a valid Twilio number
          })
          .then((message) =>
            res.status(200).send({
              message: "OTP send to " + phone,
              otp: OTP,
              success: true,
            })
          );
      } else {
        res.status(400).send({
          message: "Invalid phone",

          success: false,
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//done
exports.resetPassword = async (req, res) => {
  try {
    const { email, oldpassword, password, confirmpassword } = req.body;
    if (password == confirmpassword) {
      authentication.findOne({ email }, (err, result) => {
        if (!bcrypt.compareSync(oldpassword, result.password)) {
          res.send({
            message: "Invlid oldpassowrd",
            success: false,
          });
        } else {
          var salt = bcrypt.genSaltSync(10);

          authentication.updateOne(
            { email },
            { password: bcrypt.hashSync(password, salt) },
            (err, result) => {
              res.status(200).send({
                message: "Password is updated ",
                success: true,
              });
            }
          );
        }
      });
    } else {
      res.status(400).send({
        message: "Both password is not same ",
        success: false,
      });
    }
  } catch (err) {}
  try {
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.googlelogin = async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const passport = require("passport");


const facebookStrategy = require("passport-facebook").Strategy;
exports.facbooklogin = async (req, res) => {
  try {
    passport.use(
      new facebookStrategy(
        {
          // pull in our app id and secret from our auth.js file
          clientID: "603496006962121",
          clientSecret: "c63a6f6f8189ed75b5958b2c0c0e7341",
          callbackURL: "http://localhost:5000/facebook/callback",
        }, // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {
          return done(null, profile);
        }
      )
    );
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.applelogin = async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
