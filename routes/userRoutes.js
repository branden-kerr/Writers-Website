const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

// , (req, res) => {
//     console.log('NO ERROR YET')
//     console.log(req.body, req.files);
//     res.send("IT WORKED");
// }


// Signup, login, and logout
router.post('/signup', upload.array('image'), authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Forgot and reset password
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Restricted to admins
router.route('/').get(userController.getAllUser);

module.exports = router;
