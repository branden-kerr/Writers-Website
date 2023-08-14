const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  coverPicture: String,
  userId: String,
  userName: String,
  userImage: String,
  body: {
    type: String,
  },
  dateReceived: Date,
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
