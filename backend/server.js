const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes')
const dbConnect = require('./config/database');
const cloudinaryConnect = require('./config/cloudinary');
const producteRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute')
require('dotenv').config();

// App config
const app = express();
const PORT = process.env.PORT || 4000
dbConnect();
cloudinaryConnect();

// middlewares
app.use(express.json());
app.use(cors());

// route mounting
app.use('/api/user', userRouter)
app.use('/api/product', producteRouter)
app.use('/api/cart', cartRouter)


// default route
app.get('/', (req, res)=>{
    res.send("Default route working")
})

app.listen(PORT, ()=>{
    console.log(`server started on PORT : ${PORT}`)
})
