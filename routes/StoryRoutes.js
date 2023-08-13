const express = require('express');
const router = express.Router();

// Get all stories
router.get('/', storyController.getAllStories);

// Get a specific story by ID
router.get('/:id', storyController.getStoryById);

// Create a new story
router.post('/', storyController.createStory);

// Update a story
router.put('/:id', storyController.updateStory);

// Delete a story
router.delete('/:id', storyController.deleteStory);