const mongoose = require('mongoose');

const FeaturedStorySchema = new mongoose.Schema({
  // Define your schema based on the structure of your documents
  title: String,
  coverPicture: String,
  userName: String,
  userimage: String,
  body: String,
});

const FeaturedStory = mongoose.model('featuredStory', FeaturedStorySchema, 'featuredStories');

module.exports = FeaturedStory;