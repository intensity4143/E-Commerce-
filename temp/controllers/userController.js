const User = require('../models/UserModel');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { create } = require('../models/ProductModel');

// function to create token
const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}


// login controller
const loginUser = async(req, res) =>{
    try {
        
        const {email, password} = req.body
        const user = await User.findOne({email})

        // checking if user exists
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }             
        
        // comparing password
        const isMatch = await bcrypt.compare(password, user.password)

        // if password does not match
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }   

        // creating token
        const token = createToken(user._id)
        
        return res.status(200).json({
            success: true,
            token
        })

    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!"
        })
    }
}

// register controller
const registerUser = async(req, res) =>{
    try {
        
        const {name, email, password} = req.body

        // checking if user already exists
        const exists = await User.findOne({email})
        if(exists){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        // validating email and password
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Please enter a valid Email"
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success:false,
                message:"Password is less than 8 characters"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name, 
            email, 
            password:hashedPassword
        })

        const token = createToken(newUser._id)
        
        return res.status(200).json({
            success: true,
            token
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!"
        })
    }
}

// admin login function
const adminLogin = async(req, res) =>{
    try {
        
        const {email, password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = createToken(email+password)
            return res.status(200).json({
                success:true,
                token
            })
        }

        return res.status(400).json({
            success:false,
            message:"Invalid Credentials!"
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!"
        })
    }

}

module.exports = {
    loginUser, 
    registerUser, 
    adminLogin
};