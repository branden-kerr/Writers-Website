const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();


router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/shop', viewsController.getShop);

router.get('/login', viewsController.getLogin);
router.get('/signup', viewsController.getSignup);
router.get('/account', viewsController.getMyAccount);

module.exports = router;
