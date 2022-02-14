const Student = require('./models/student.js');

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

        const newStudent = new Student({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password, // TODO: salt and encrypt password
            personalCode: req.body.personalCode
        });
        const savedStudent = await newStudent.save();
        // TODO: return better object for client Jscript or a nicer page
        res.status(201).json({ msg: `Naujas mokinys vardu ${newStudent.name} sukurtas sėkmingai. Prisijungimui prie sistemos naudokite: ${newStudent.email}` });
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
        res.status(404).json({ msg: "Nurodytas mokinys nerastas" });
        return;
    }

    // TODO: verify password

    //res.status(200).render('./appForAll.ejs')
    res.json(student)
}

/**
 * Funkcija tikisi kad bus nustatyta res.student : Student (žr. getUser())
 */
const patchUser = async (req, res) => {
    try {
        if (req.body.name != null) {
            res.student.name = req.body.name
        }
        if (req.body.surname != null) {
            res.student.surname = req.body.surname
        }
        if (req.body.email != null) {
            res.student.email = req.body.email
        }
        if (req.body.password != null) {
            res.student.password = req.body.password
        }
        if (req.body.personalCode != null) {
            res.student.personalCode = req.body.personalCode
        }

        const updatedUser = await res.student.save();
        res.json(updatedUser);
    }
    catch (error) {
        // TODO: status code may be incorrect - what kind of exceptions do we expect to deal with here? invalid user input? internal server error? both?
        console.error(`Klaida keičiant mokinio duomenis: ${error}`);
        res.status(400).json({ msg: "Nepavyko pakeisti duomenų apie mokinį" });
    }
}

/**
 * Funkcija tikisi kad bus nustatyta res.student : Student (žr. getUser())
 */
const deleteUser = async (req, res) => {
    try {
        await res.student.remove()
        res.json({ msg: "Success" })
    }
    catch (err) {
        // TODO: status code may be incorrect - what kind of exceptions do we expect to deal with here? invalid user input? internal server error? both?
        console.error(`Klaida ištrinant mokinį: ${error}`);
        res.status(400).json({ msg: 'Nepavyko ištrinti mokinio' });
    }
}

/**
 *
 */
const getAllUsers = async (req, res) => {
    try {
        const allStudents = await Student.find();
        res.json(allStudents);
    }
    catch (error) {
        // TODO: status code may be incorrect - what kind of exceptions do we expect to deal with here? invalid user input? internal server error? both?
        console.error(`Klaida registruojant mokinį: ${error}`);
        res.status(400).json({ msg: 'Nepavyko užregistruoti naujo mokinio' });
    }
}

/**
 *
 */
const postUserId = (req, res) => {
    student = res.student;
    student.name = res.student.name;
    student.surname = res.student.surname;
    student.email = res.student.email;
    student.personalCode = res.student.personalCode;
    student.password = res.student.password;

    res.render('./appForAll.ejs');
};

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
    postUserId,
    getAllUsers,
    getUser,
    deleteUser,
    patchUser
}