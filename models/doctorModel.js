const validator = require('validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
  url: String,
  filename: String
});

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  geometry: {
    type: {
        type: String,
        enum: ['Point'],
        // required: true
    },
    coordinates: {
        type: [Number],
        // required: true
    }
},
  location: [String],
  phone: [String],
  website: {
    type: String
  },
  images: [ImageSchema]
});



const Doctor = mongoose.model('Doctor', doctorSchema);


module.exports = Doctor;
