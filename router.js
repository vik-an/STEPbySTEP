const express = require('express')
const router = express.Router();

const { 
    
    getUser,
    postUserId,
    postRegister,
    getRegister,
    getLogin,
    postLogin,
    allUsers,
     deleteUser,
    editUser
} = require('./controllers');
const {pasirinkimas} = require('./bkk')

router.route('/register').get(getRegister).post(postRegister);
router.route('/users').get(allUsers)
//user dalis skirta tik adinistratoriams:
router.route('/users/:id').get(getUser,postUserId).delete(getUser, deleteUser).patch(getUser,editUser);
router.route('/sos').get(pasirinkimas);
router.route('/login').get( getLogin).post( postLogin);


module.exports = router