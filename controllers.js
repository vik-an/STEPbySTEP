const Student = require('./models/student.js');
const bcrypt = require("bcrypt");
var session = require('express-session')

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
        res.status(201).json({ msg: `Naujas mokinys vardu ${newStudent.name} sukurtas sėkmingai. Prisijungimui prie sistemos naudokite: ${newStudent.email} ir slaptažodį` });
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
const postLogin = async (req, res) => {
    const student = await Student.findOne({ email: req.body.email });
    if (student == null) {
        req.session.error = "nurodytas mokinys nerastas";
        return res.redirect("/login");
        // res.status(404).json({ msg: "Nurodytas mokinys nerastas" });
        // return;
    } else if(student){
        const validPassword = await bcrypt.compare(req.body.password, student.password)
        if( validPassword){
            req.session.email = student.email;
            res.redirect("/appForAll.ejs")
          //  res.status(200).json({msg: `Sveiki prisijungę ${student.name}` })


         } else{ 
       // res.status(400).json({ error: " Neteisingas slaptažodis"})
        req.session.error = "Neteisingas slaptažodis";
        return res.redirect("/login");
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