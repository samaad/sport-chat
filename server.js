const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');

container.resolve(function(users, _){
  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true)
  mongoose.connect('mongodb://localhost:27017/sport-chat',  { useUnifiedTopology: true, useNewUrlParser: true })
  const app = SetupExpress();

  function SetupExpress() {
    const app = express();
    const server = http.createServer(app);

    server.listen(5555, function(){
      console.log('Listening on port 5555');
    });

    ConfigureExpress(app);
   
    // Setup router
    const router = require('express-promise-router')();
    users.SetRouting(router)
    app.use(router);
  
  }

  function ConfigureExpress(app){
    require('./passport/passport-local');
    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(session({
      secret: 'thisisasecretkey',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongooseConnection: mongoose.connection})
    }));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.locals._ = _;
  }

});