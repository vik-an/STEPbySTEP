const express = require('express')
const router = express.Router();
const {
postUserId,
getAllUsers,
	deleteUser,
	patchUser
} = require("./adminControllers.js");

const  { getSesion } = require("./userControllers.js")

const {
	getUser,
	postRegister,
	getRegister,
	getLogin,
	postLogin	
} = require('./controllers.js');
const { pasirinkimas } = require('./bkk.js')

router.route('/register').get(getRegister).post(postRegister);
router.route('/users').get(getAllUsers)
//user dalis skirta tik adinistratoriams:
router.route('/users/:email').get(getUser, postUserId).delete(getUser, deleteUser).patch(getUser, patchUser);
router.route('/sos').get(pasirinkimas);
router.route('/login').get(getLogin).post(postLogin);
router.route('/userExp').get(getSesion).post(postLogin);

module.exports = router