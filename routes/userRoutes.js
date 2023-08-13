const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const multer = require('multer');
const { storage, } = require('../cloudinary');
const upload = multer({ storage });
const router = express.Router();

router.post('/signup', upload.single('image'), async (req, res, next) => {
  console.log('got to signup');
  await authController.signUp(req, res, next);

});
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Forgot and reset password
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Restricted to admins
router.route('/').get(userController.getAllUser);

module.exports = router;
