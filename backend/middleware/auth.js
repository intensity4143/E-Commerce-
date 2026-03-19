const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    
    // extract token from headers.authorization
    const token = req.headers?.authorization?.split(' ')[1]

    if(!token){
        return res.json({
            success:false,
            message: "Not Authorized Login Again"
        })
    }

    try {
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)  
        req.body.userId = token_decoded.id  
        next();
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = authUser