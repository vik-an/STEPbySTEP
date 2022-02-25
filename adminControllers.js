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


module.exports = {
    postUserId,
    getAllUsers,
    deleteUser,
    patchUser
}