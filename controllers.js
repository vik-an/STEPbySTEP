const { append } = require('express/lib/response');
const fs = require('fs');
const { now } = require('mongoose');
const mokiniai = require('./models/mokiniai');
//const document = require("app")

////////////
const getRegister =(req, res) =>{
    res.status(200).render('./register.ejs') 
    console.log("bakst į serverį iš registracijos get ")
};
/////////
const postRegister = async (req, res)=> {
    const Mokinys = new mokiniai({
        id: Date.now(),
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        asmens_kodas: req.body.asmens_kodas
    })

    console.log("bando registruotis  naujas Mokinys", Mokinys)
    try{ // patikrinti ar toks mokinys jau yra ir neleisti vel registruotis
        const burbulas = await mokiniai.find({asmens_kodas: Mokinys.asmens_kodas})
        
        if(burbulas.length !== 0){
            console.log( "same asmens_kodas  ",burbulas);
            res.send(" Tokiu asmens kodu  mokinys jau yra užregistruotas")
        }else{
        const newMokinys = await Mokinys.save()

         res.status(201).json({msg: ` mokinys vardu ${req.body.name} sukurtas sėkmingai. Prisijungimui prie sistemos Jums sukurtas  ID : ${newMokinys.id}`})
        
        console.log("naujas mokinys: ", newMokinys)}
    }catch(err){
        res.status(400).json({ msg: err.message})
    }
    
    let Mok = JSON.stringify([req.body]);
    fs.writeFileSync('./mokiniaiVisi.txt',` mokinys: id ${Date(now)}  ${Mok} `,{flag: "a"})
};

//////////////////////
 const getLogin =  (req,res) =>{
    res.status(200).render('./login.ejs')
     console.log( "get Logine yra : " , req.body)
     
 };

 //////////
 const postLogin = async ( req,res) =>{
    //let mokinys
       console.log(req.params)
       const { id} = req.body;
       const { email } = req.body,
       mokinys = await mokiniai.find({ id: id, email : email })
      
         if(mokinys == null)  {
                return res.status(404).json({msg: "Tokiu email arba asmens kodu mokinio nėra"})
                
            }
               
         else{      
           
   
     
    
    
    res.mokinys = mokinys
    //res.status(200).render('./appForAll.ejs')
    res.status(200).json({mokinys})
    console.log("toks yra : ", mokinys)
}
 }
////////////
const editUser = async (req, res) => {

   // console.log(" editUser pradzia", req.body)
if (req.body.name != null){
    res.mokinys.name = req.body.name
}
if (req.body.surname != null){
    res.mokinys.surname = req.body.surname
}
if (req.body.email != null){
    res.mokinys.email = req.body.email
}
if (req.body.password != null){
    res.mokinys.password = req.body.password
}
if (req.body.asmens_kodas != null){
    res.mokinys.asmens_kodas = req.body.asmens_kodas
}
try { const updatedUser = await res.mokinys.save()
res.json(updatedUser)
} catch(err) {
    res.status(400).json({msg: err.message})
}
}

///////////
 const deleteUser = async  (req, res) => {
     try{ 
         await res.mokinys.remove()
         res.json({ msg: " Delete mokinys"})

     }catch (err){
         res.status(500).json({ msg: err.message})
     }
 }



 //////////
 const allUsers = async (req,res) => {
    try{
        const Mokiniai = await mokiniai.find()
        res.json(Mokiniai)
 }catch(err) {
     res.status(500).json({msg: err.message})
 }
  } 

  //////////////////
const postUserId =  (req, res)=> {

   
   
    mokinys = res.mokinys;
    mokinys.name = res.mokinys.name;
    mokinys.surname = res.mokinys.surname;
    mokinys.email = res.mokinys.email;
    mokinys.asmens_kodas = res.mokinys.asmens_kodas;
    mokinys.password =  res.mokinys.password;

res.status(200).render('./appForAll.ejs')
 //res.status(500).send(res.mokinys.name);


    console.log(mokinys)
};


  /////////////
async function getUser(req, res, next){
    let mokinys
    console.log("  get user funk req ", req.body)
    try{
        mokinys = await mokiniai.findById(req.params.id)
            if(mokinys == null)  { // neveikia, nes id o ne _id... :(
                return res.status(404).json({msg: "Tokiu ID mokinio nėra"})
            }
    }catch(err){
            return res.status(500).json({msg: err.message})
    } 
    res.mokinys = mokinys
    console.log(" getUseryje yra : " , mokinys);
   next()
}





 module.exports = {  getLogin,  getRegister, postLogin, postRegister, postUserId, allUsers, getUser, deleteUser, editUser }