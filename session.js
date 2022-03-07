const session = require('express-session');
var MongoStore = require('connect-mongo');
const express = require('express')

const sess = express();
sess.use(session({
    secret: 'secret word',
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/draiveris_session',
    touchAfter: 24 * 3600,
    cookie: { maxAge: 1000*60*6024}

     })
  }));

  module.exports= sess