require('dotenv').config();
const { json } = require('body-parser');
const { config } = require('dotenv');
const express = require('express')
const router = require('./router.js')
const mongoose = require('mongoose');
const sessions = require('express-session');
var MongoStore = require('connect-mongo');
var parseurl = require('parseurl');

const path = require('path/posix');

// const serveStatic = require('serve-static');

const dbUri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/draiveris';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => { console.log(`DB prisijungimas sėkmingas: ${dbUri}`); }
    // Initial DB connect error will end the server, but it's of no use without DB anyway
    // error => { console.error(`DB prisijungimo klaida: ${error}`); } 
);
mongoose.connection.on('error', error => {
    console.error(`DB klaida: ${error}`);
});




const app = express()
app.use(express.json()); //json tam kad veiktų vidinės funkcijos
app.set('views engine, ', 'ejs')
app.set('views', __dirname + '/views') //nustato kad vaizdu ieskos views faile, ir daugiau jo kartoti nebereikia
app.use(express.static('./public')) //  IR VISTIEK  neveikia...
//app.use(serveStatic('public/style.css', { index: 'default.html' }))
app.use(express.urlencoded({ extended: false })) //kad skaitytu gautą tekstą iš html
app.set('trust proxy', 1)
 
app.use(sessions({
    secret: 'secret word',
    saveUninitialized: false,
    resave: false,
    cookie: {  maxAge: 1000 * 60 * 60 * 24 * 7,
     
     },
    
    //  store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/draiveris',
    //  collection: 'Sessions',
    //  touchAfter: 24 * 3600,
    //      // cookie: {  maxAge: 1000 * 60 * 60 * 24 * 7, secure: true  },
    //      connectionOptions: {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         serverSelectionTimeoutMS: 10000
    //       }
    //  })
   }));


   


   app.use(function (req, res, next) {
    if (!req.session.views) {
      req.session.views = {}
    }
    var pathname = parseurl(req).pathname;
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
    next()
})
  


app.use('/', router)

app.get('/', (req, res) => {

    res.status(201).render('./face.ejs')
    console.log(req.session)
   
})


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


app.all('*', (req, res) => {
    res.status(404).render("./error.ejs")
})

const serverPort = process.env.PORT || 5001;
app.listen(serverPort, () => {
    console.log(`Great success - server listening on port ${serverPort}`);
});
