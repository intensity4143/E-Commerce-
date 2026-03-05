const mongoose = require('mongoose')

dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('DB connected Successfully')
    } 
    catch (error) {
        console.log("error while connecting with DB")
        console.error(error)
        process.exit(1)
    }
}

module.exports = dbConnect