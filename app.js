const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const ejsMate = require('ejs-mate');
const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const surgeryRouter = require('./routes/surgeryRoutes');
const AppError = require('./utils/AppError');
const dotenv = require('dotenv');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
// I don't remember if I need the below or not
const { localsName } = require('ejs');
const moment = require("moment");
const autocomplete = require("autocompleter");


const app = express();

// Connects app to the configuration file
dotenv.config({ path: './config.env' });

app.locals.autocomplete = autocomplete;

// Set rendering engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Implementing CORS
app.use(cors());
app.options('*', cors());

// Serving Static HTML and JS files from the frontend
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/my-account', (req, res, next) => {
  res.status(200).json({
    data: 'This is my account',
  });
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Test Middleware
app.use((req, res, next) => {
  //console.log(req.cookies);
  next();
})


// Makes sure ejs can allow undefined variables or something in if else statements
app.use((req, res, next) => {
  res.locals.user = req.user;
  // console.log(res.locals.user);
  next();
})

app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/surgeries', surgeryRouter);




// 404 for not defined pages
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
