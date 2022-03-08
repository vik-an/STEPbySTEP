const Student = require('./models/student.js');
const bcrypt = require("bcrypt");
// var session = require('express-session')
// const express = require('express')
// const mongoose = require('mongoose');

// var MongoStore = require('connect-mongo');

/**
 *
 */
const getRegister = (req, res) => {
    res.render('./register.ejs')
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
        res.status(201).json({ msg: `Naujas mokinys vardu ${newStudent.name} sukurtas sėkmingai. Prisijungimui prie sistemos naudokite: ${newStudent.email} ir slaptažodį ` });
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
    res.render('./login.ejs');
};

/**
 *
 */
const postLogin = async (req, res, next) => {
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
            //sesijos pradžia
            // console.log("jungiamasi prie sesijos");
            // const sess = express();
            // sess.use(session({
            //     secret: 'secret word',
            //     saveUninitialized: true,
            //     resave: false,
            //     store:  MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/draiveris_session',
            //     touchAfter: 24 * 3600,
            //     cookie: { maxAge: 1000*60*60*24}
            
            //      })
                
            //   }));
           
             console.log(`sesija vyksta `)
             console.log(req.session)
              // req.session.email = student.email;
            res.status(200).render('./userExp.ejs');

          
        
        //    res.status(200).json({msg: `Sveiki prisijungę ${student.name}` })


         } else{ 
       res.status(400).json({ error: " Neteisingas slaptažodis"})
       console.log("netiko password")
        // req.session.error = "Neteisingas slaptažodis";
        // return res.redirect("/login");
           ;}

    }

    // TODO: verify password

    //res.status(200).render('./appForAll.ejs')
   
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
    postLogin,
    postRegister, 
    getUser,
}