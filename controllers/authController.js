const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

// Sign the token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and sent token to the user
const createSendToken = (user, statusCode, req, res) => {

  console.log(`userID: ' + ${user._id}`)
  const token = signToken(user._id);
  console.log(`token: ' + ${token}`)

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;
  res.redirect('/');

};

// Signup the user
exports.signUp = catchAsync(async (req, res, next) => {


  const newUser = await User.create({
    name: req.body.user['name'],
    email: req.body.user['email'],
    password: req.body.user['password'],
    passwordConfirm: req.body.user['passwordConfirm'],
    images: {
      url: req.file.path,
      filename: req.file.filename
    }
  });
  createSendToken(newUser, 201, req, res);
});

// Log the user in
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  console.log('got to login')

  // 1) Check if email and passowrd exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 201, req, res);
});

// Log the user out
exports.logout = async (req, res) => {
  res.cookie('jwt', 'logged_out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect('/')
};

// Protect a particular route
exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! PLease log in to get access.')
    );
  }

  // Verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this id does not exist', 401)
    );
  }

  // Check if the user changed the password after signup
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The user has recently changed his passoword please relogin again!',
        401
      )
    );
  }

  // Grant the user access and set the locals
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      //  console.log(decoded.id, currentUser);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      req.user = currentUser;

      return next();
    } catch (err) {
      console.log(err.message);
      return next();
    }

  }
  next();
};

// Restrict actions to certian users
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have the permission to do this action!', 403)
      );
    }
    next();
  };
};

// Forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user with the POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with that address!', 403));
  }

  // Generate a random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    console.log(resetToken);
    res.status(200).json({
      status: 'success',
      resetToken, // Remove this in production
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email!', 500));
  }
});

// Reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Change the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    message: 'success',
  });
});

// Update the currently logged in user's password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
});
