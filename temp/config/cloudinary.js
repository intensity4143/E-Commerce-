const cloudinary = require('cloudinary').v2

const cloudinaryConnect = async ()=>{
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })

        console.log('connected to cloudinary')
    } 
    catch (error) {
        console.log('error while connecting to cloudinary')
        console.error(error)
        process.exit(1);
    }
}

module.exports = cloudinaryConnect

