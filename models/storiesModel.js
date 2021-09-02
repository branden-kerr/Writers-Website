const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const storySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  dateReceived: Date,
});



const Story = mongoose.model('Story', storySchema);


module.exports = Story;
