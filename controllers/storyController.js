const User = require('./../models/storiesModel');

exports.getAllStories = async (req, res, next) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (err) {
    next(err);
  }
};

exports.getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    res.status(200).json(story);
  } catch (err) {
    next(err);
  }
};

exports.createStory = async (req, res, next) => {
  try {
    const story = await Story.create(req.body);
    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
};

exports.updateStory = async (req, res, next) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(story);
  } catch (err) {
    next(err);
  }
};

exports.deleteStory = async (req, res, next) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};