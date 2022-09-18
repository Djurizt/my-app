require('dotenv').config()
const Joi =  require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const saltRounds = 10

const hashMyPassword = (mypassword) => {
    
    return new Promise((resolve, reject) => {

        bcrypt.genSalt(saltRounds,  (err, salt)=> {
            bcrypt.hash(mypassword, salt,  (err, hash)=> {
                if (err) {
                    reject(err)
                }
                resolve([salt, hash])
            });
        });
 

    })
}
const createNewUser = async (req,res) =>{
    //1. validate data
    const adminSchema = Joi.object({ 
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        image: Joi.string().required()
        
    })
    const validateUser = adminSchema.validate(req.body)
    if (validateUser.error) {
        res.status(422).send({
            status: false,
            message: validateUser.error.details[0].message
        })
    }else{
    
    //2. create in DB
    //3. check if the user has been previously created

    const {email,password,image} = req.body
    const hashedPassword = await hashMyPassword(password)
    const realPassword = hashedPassword[1]
    
    userModel.checkIfUserExist(email)
    .then (usersResult => {
        if(usersResult != ""){
            throw new Error ("A user with this email already exist")
        }
        return userModel.newUser(email,realPassword,image)
    })
    
    .then(result =>{
            res.status(200).send(
                {
                    status: true,
                    message: "User successfully created"
                })
            })
    .catch(error =>{
        res.status(400).send({
            status: false,
            message: error.message
            })       
        })
    }
}

const Login = async (req, res) => {
    
    const {email,password} = req.body

    userModel.getUserDetailsByEmail(email)
    .then(resultFromLogin => {
        if (resultFromLogin =="") {
    
            throw new Error("Invalid Credentials")
        }
            payload = resultFromLogin[0]
            return bcrypt.compare(password, payload.hashedPassword)
        
    })
    .then(resultFromPasswordCompare => {
        if (resultFromPasswordCompare == false) {
            throw new Error("Invalid Email or Password")
        }

        const dataToAddInMyPayload = {email: payload.email}
                jwt.sign(dataToAddInMyPayload, process.env.JWT_SECRET, { expiresIn : process.env.JWT_EXPIRES_TIME },
                (err, token) => {
                    if (err) {
                        throw new Error("Internal server error")
                    }
                 
                    res.setHeader('token', token)
                        res.status(200).send({
                                status: true,
                                message: "Successfully logged in"
                   })
                   
                }
        

           )

         
        
    })
    .catch(err => {
        
        res.status(400).send({
            status: false,
            message: err.message||"Something went wrong"
        })
    })
  


}


    module.exports={
        createNewUser,
        hashMyPassword,
        Login
    }