const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './.env' });

const app = require('./app.js');

// Database
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// Mongoose connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to DB');
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});