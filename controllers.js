const Student = require('./models/student.js');
const bcrypt = require("bcrypt");
var session = require('express-session')
const express = require('express')
const mongoose = require('mongoose');

var MongoStore = require('connect-mongo');

/**
 *
 */

 var sess;
const getRegister = (req, res) => {
    sess = req.session;
    if(sess.userid){
        res.send("Jei norite registruotis - atsijunkite nuo sesijos:  <a href=\'/logout'>click to logout</a>");
    }else{
     res.render('./register.ejs')
    }

};

/**
 * Užregistruoja naują mokinį.
 * Grąžina klaidą, jei mokinys su tokiu pat asmens kodu jau registruotas.
 */
const postRegister = async (req, res, next) => {
    try {
        if (await Student.exists({ personalCode: req.body.personalCode })) {
            return res.status(409).send(" Tokiu asmens kodu mokinys jau yra užregistruotas");
        }

        const newStudent = new Student(req.body );
        // password && save:
        const salt = await bcrypt.genSalt(10);
        newStudent.password = await bcrypt.hash(newStudent.password, salt);
        const savedStudent = await newStudent.save();

        // TODO: return better object for client Jscript or a nicer page
        res.status(201).send( `Naujas mokinys vardu ${newStudent.name} sukurtas sėkmingai. Prisijungimui prie sistemos naudokite: ${newStudent.email} ir slaptažodį. <a href=\'/login'>click to login</a> ` );
    }
    catch (error) {
        // TODO: status code may be incorrect - what kind of exceptions do we expect to deal with here? invalid user input? internal server error? both?
        console.error(`Klaida registruojant mokinį: ${error}`);
        res.status(400).send({ msg: "Nepavyko užregistruoti naujo mokinio" });
    }
};

/**
 *
 */
const getLogin = (req, res) => {

    sess = req.session;
    console.log(sess)
    if(sess.userid){
        res.status(200).render('./userExp.ejs')
    }else{
        res.render('./login.ejs');
    }
    
};

/**
 *
 */
// postLogin === auth
const auth = async (req, res, next) => {
    const student = await Student.findOne({ email: req.body.email });
    if (student == null) {
        req.error = "nurodytas mokinys nerastas";
        console.log(" mokinys nerastas");
        return res.redirect("/login");
        
        // res.status(404).json({ msg: "Nurodytas mokinys nerastas" });
        // return;
    } else if(student){
        const validPassword = await bcrypt.compare(req.body.password, student.password)
       var rek = req.body.password;
        console.log(`patikrino pasworda ${rek}`)
        if( validPassword){ 
         
           
             console.log(`sesija vyksta `)
             console.log('req.session.id ', req.session.id)
              // req.session.email = student.email;
           // res.status(200).render('./userExp.ejs');
           // res.session(200).render('./login.ejs');
          
        
        //    res.status(200).json({msg: `Sveiki prisijungę ${student.name}` })

next()
         } else{ 
       res.status(400).json({ error: " Neteisingas slaptažodis"})
       console.log("netiko password")
        // req.session.error = "Neteisingas slaptažodis";
        // return res.redirect("/login");
           ;}

    }

   
   
}
 
// const getLogin = (req, res) => {
//     res.render('./login.ejs');
// };
const loggedSuccess = (req,res) => {

    
   // res.session(200).render('./userExp.ejs');
   console.log("req body : ", req.body)
   sess = req.session;
   console.log(  " loggedSuccess session id", req.session.id)
   sess.userid = req.body.email;
   console.log(" req. session:", req.session)
  // res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
     res.status(200).render('./userExp.ejs')
}

/**
 * Funkcija tikisi kad bus nustatyta res.student : Student (žr. getUser())
 */

/**
 * Randa mokinį su parametruose nurodytu email
 */
async function getUser(req, res, next) {
    try {
        const student = await Student.findOne({ email: req.params.email })
        if (!student) {
            res.status(404).json({ msg: "Tokio mokinio nėra" });
            return;
        }

        res.student = student;
        res.json(student);
        next();
    }
    catch (error) {
        console.error(`Klaida ieškant mokinio: ${error}`);
        res.status(400).json({ msg: "Nepavyko surasti mokinio" });
    }
}


module.exports = {
    getLogin,
    getRegister,
    auth,
    postRegister, 
    getUser,
    loggedSuccess
}