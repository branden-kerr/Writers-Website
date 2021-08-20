const catchAsync = require('./../utils/catchAsync');
const Surgery = require('./../models/surgeryModel');
const { localsName } = require('ejs');
const User = require("../models/userModel");

const Doctor = require('./../models/doctorModel');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken })







exports.createSurgery = catchAsync(async (req, res, next) => { 

  // I think surgery.create finishs quickk, but if it took time the _id wouldn't be ready yet to pass into User,
  // So maybe fix this later
    const newSurgery = await Surgery.create({
      name: req.body.name,
      dateReceived: req.body.date,
      user: res.locals.user._id
    });

    console.log('were updating the user to contain the new surgerys id');

  User.findByIdAndUpdate(res.locals.user._id,
    {$push: {"surgeries": newSurgery._id}},
    {safe: true, upsert: true, new : true},
    function (err, docs) {
      if (err){
          console.log(err)
      }
  }
);

  const geoData = await geocoder.forwardGeocode({
    query: req.body.locationDoctor,
    limit: 1
  }).send()

  const newDoctor = await Doctor.create({
    name: req.body.nameDoctor,
    geometry: geoData.body.features[0].geometry,
    location: req.body.locationDoctor
  })

    res.redirect('http://127.0.0.1:3000');
  
  
  });