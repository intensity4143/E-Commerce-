const User = require('../models/UserModel');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// function to create token
const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

const loginUser = async(req, res) =>{
    try {
        return res.json({
            msg:"user login api working"
        })
    } catch (error) {
        
    }
}

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

const adminLogin = async(req, res) =>{
    try {
        return res("admin api working")
    } catch (error) {
        
    }

}

module.exports = {
    loginUser, 
    registerUser, 
    adminLogin
};