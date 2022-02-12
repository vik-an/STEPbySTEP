require('dotenv').config()
const { json } = require('body-parser');
const { config } = require('dotenv');
const express = require('express')
const app = express()
const router = require('./router')


const mongoose = require('mongoose');
const path = require('path/posix'); 
const { query } = require('express');
const serveStatic = require('serve-static');
//const expressLayouts = require('express-ejs-layouts')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true});
// nustatymas kuris parodo kur klaida kelyje i db
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('sėkmingai prisijungta prie duomenų bazės'))

//json tam kad veiktų vidinės funkcijos
app.use(express.json())
app.set('views engine, ' ,'ejs' )
app.set('views',__dirname + '/views') //nustato kad vaizdu ieskos views faile, ir daugiau jo kartoti nebereikia
app.use(express.static('./public')) //  IR VISTIEK  neveikia...
//app.use(serveStatic('public/style.css', { index: 'default.html' }))
app.use(express.urlencoded({ extended: false})) //kad skaitytu gautą tekstą iš html

//app.use(serveStatic())
//
app.use('/',router)

app.get('/',(req,res)=>{
    res.status(201).render('./face.ejs')
})

app.all('*', (req, res) => {
    res.status(404).render("./error.ejs")
  }) 


app.listen(5001,() =>{
    console.log(`serveris veikia per  port 5001...`)
})