const mongoose = require('mongoose');

const FeaturedStorySchema = new mongoose.Schema({
  title: String,
  coverPicture: String,
  userName: String,
  userImage: String,
  body: String,
});

const FeaturedStory = mongoose.model('featuredStory', FeaturedStorySchema, 'featuredStories');

module.exports = FeaturedStory;