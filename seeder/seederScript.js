const Doctor = require('../models/doctorModel');
const doctors = require('../data/doctors');
require('dotenv').config({path:'./config.env'})
const mongoose = require('mongoose');

const cloudinary = require('cloudinary').v2;

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken })


const dbUrl = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
) ;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
// .then(() => {
//     console.log('Connected to DB');
//   });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


console.log(doctors[0].name)

const seedDB= async () => {
    for(i=0; i<doctors.length; i++){

        const doctor = doctors[i];

        const geoData = await geocoder.forwardGeocode({
            query: doctor.location,
            limit: 1
          }).send()

        // File upload
        cloudinary.uploader.upload(`C:/Users/iii/Desktop/amazon-clone-master/public/images/${doctor.name}.jpg`,
        { folder: 'test' },
         function (err, image) {
            if (err) {
                (err.code === 'ENOENT') ? console.log(`${doctor.name} doesn't have an image`) : console.log(err) 
            }
            createDoctor(image);
        });

        const createDoctor = async (image) => {

            await Doctor.create({
                name: doctor.name,
                geometry: geoData.body.features[0].geometry, 
                location: doctor.location,
                phone: doctor.phone,
                website: doctor.website,
                images: (image) ? ({ url: image.url, filename: `${doctor.name}.jpg` }) : null
            })

        }
    }
}

seedDB();