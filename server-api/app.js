const express = require('express');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const models = require('./database/models');
const routes = require('./routes');

const app = express();
dotenv.config();
const port = process.env.PORT || 9999;

// #region view engine
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  res.render('index', {
    title: process.env.APP_NAME,
    app_name: process.env.APP_NAME,
    message: 'Running Now!',
  })
})
//#endregion

app.use(logger('dev'));
app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./utils/passport')(passport);
app.use(useragent.express());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const http = require('http').Server(app);
//#region 
app.use('/api', routes);
//#endregion router

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler generate by express generator
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// jika dalam production
if (process.env.NODE_ENV === "production") {
  app.set('trust proxy', 1)
}

app.get('/', (req, res) => {
  res.send(process.env.APP_NAME);
})

models.sequelize
  .authenticate()
  .then(() => {
    console.log('koneksi database berhasil');
    http.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('koneksi database gagal:', err);
  });


module.exports = app;
