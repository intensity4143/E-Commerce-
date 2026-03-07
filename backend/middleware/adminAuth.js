const jwt = require("jsonwebtoken")

const adminAuth = async(req, res, next)=>{
    try {    

        // extract token from headers.authorization
        const token = req.headers?.authorization?.split(' ')[1]

        // if token not found
        if(!token){
            return res.status(401).json({
                success:false,
                message: "Not Authorized, Login Again!"
            })
        }

        const decode_token = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode_token)

        // Compare the decoded token with admin email+password combination
        if(!decode_token.isAdmin || decode_token.admin !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(400).json({
                success: false,
                message: "Not Authorized Login Again"
            })
        }

        next();

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = adminAuth