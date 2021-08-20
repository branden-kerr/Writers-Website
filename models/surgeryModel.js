const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const surgerySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  dateReceived: Date,
});



const Surgery = mongoose.model('Surgery', surgerySchema);


module.exports = Surgery;
