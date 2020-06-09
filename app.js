
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { MongoMemoryServer } = require('mongodb-memory-server'); // for use with tests
require('dotenv').config();

const logger = require('./utils/winston');
const userRoutes = require('./routes/user');
const binRoutes = require('./routes/bin');
const auth = require('./middleware/auth');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// serve static files out of public folder
// app.use(express.static('public'));

// parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongoOptions = {
  //   user: process.env.MONGO_USERNAME,
  //   pass: process.env.MONGO_PASSWORD,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
};

// a MongoDB server running on memory for use with tests
const mongoServer = new MongoMemoryServer();

// Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// if the NODE_ENV_TESTING var is set to true // the var is a string
// use mongodb in-memory server
if (process.env.NODE_ENV_TESTING === 'true') {
  try {
    // connect to in-memory mongodb Server
    // eslint-disable-next-line no-underscore-dangle
    mongoServer.getUri().then((mongoUri) => {
      mongoose.connect(mongoUri, mongoOptions);
      logger.debug('using mongo-memory-server');
    });
  } catch (error) {
    logger.error(`Mongoose | ${error.message}`);
  }
} else {
  // use mongodb atlas in development & production
  try {
    mongoose.connect(process.env.MONGO_URI, mongoOptions);
  } catch (error) {
    logger.error(`Mongoose | ${error.message}`);
  }
}

// Get the default connection
const db = mongoose.connection;
db.on('error', (err) => {
  logger.error(`MongoDB | ${err.message}`);
});

// server start listening once connected to db
db.on('open', () => {
  logger.info('MongoDB is up');
  app.listen(process.env.PORT).on('listening', () => logger.info('Server listening'))
    .on('error', (err) => { logger.error(`Server | ${err.message}`); });
});

// map endpoint path to route file
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bins', auth, binRoutes);
app.use('/api/v1', userRoutes); // to allow POST /login route

// any invalid endpoints that don't match the above are handled here
app.use((req, res, next) => {
  if (res.headersSent) {
    // express handles this if headers had already been sent and sth went wrong
    next();
    return;
  }
  // we handle it
  // make a new error instance and forward it to the error-handler using next()
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// custom error handling middleware i.e. for errors passed in next(error)
app.use((err, req, res, next) => {
  // TODO:log these errors
  if (res.headersSent) {
    // express handles the error if headers had already been sent and sth went wrong
    next(err);
    logger.error(`${req.url} | ${err.message}`);
    return;
  }
  // set status to the status code of the error, otherwise 500 is default e.g. for db errors
  res.status(err.status || 500);
  res.set({ 'Content-type': 'application/json' });
  res.json({ message: err.message });
  logger.error(`${req.url} | ${err.message}`);
});
