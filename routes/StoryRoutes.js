const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');
const multer = require('multer');
const { storage, } = require('../cloudinary');
const upload = multer({ storage });

// Get all stories
router.get('/', storyController.getAllStories);

// Get a specific story by ID
router.get('/:id', storyController.getStoryById);

// Create a new story
router.post('/newStory', authController.isLoggedIn, upload.single('image'), async (req, res, next) => {
  console.log('got to the right route for new story')
  console.log(req.user)
  console.log(res.locals.user)
  await storyController.createStory(req, res, next);

});

// Update a story
router.put('/:id', storyController.updateStory);

// Delete a story
router.delete('/:id', storyController.deleteStory);

module.exports = router;
