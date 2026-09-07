let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let dotenv = require("dotenv")

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let searchRouter = require("./routes/search");
let specialtiesRouter = require("./routes/specialties");
let verifyMiddleware = require("./middlewares/verify");
let db = require("./models")

let app = express();
let cors = require('cors');

dotenv.config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/specialties', specialtiesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  res.json({
    error: {
      message: err.message,
      status: status,
      stack: req.app.get('env') === 'development' ? err.stack : undefined
    }
  });
});

module.exports = app;
