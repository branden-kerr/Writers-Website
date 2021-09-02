const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");

exports.getOverview = async (req, res, next) => {
  // res.status(200).json({
  //   data: 'Hey I got it',
  // });
  res.status(200).render('overview', {
    page_name: 'overview'
  });
};

exports.getShop = async (req, res, next) => {
  res.status(200).render('shop', {
    page_name: 'shop'
  });
};

exports.getLogin = async (req, res, next) => {
  res.status(200).render('login', {
    age: 16,
    page_name: 'login'
  });
};

exports.getSignup = async (req, res, next) => {
  res.status(200).render('signup', {
    page_name: 'signup'
  })
};

exports.getMyAccount = async (req, res, next) => {

  // const userWithSurgeries = await User.findById(res.locals.user._id).populate('surgeries');
  // const doctors = await Doctor.find({});

  // res.status(200).render('myAccount', {userWithSurgeries, doctors, page_name: 'myAccount'});
  // res.status(200).render('account', {
  //   page_name: 'account'
  // })
  try {
    res.status(200).render('account', {
      page_name: 'account'
    });
  } catch (error) {
    console.log(error);
  }

  
}

exports.getNewStory = async (req, res, next) => {

  res.status(200).render('newStory', {
    page_name: 'newStory'
  })
};

