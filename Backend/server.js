const express = require('express');
const cors = require('cors');
require('dotenv').config();

// App config
const app = express();
const PORT = process.env.PORT || 4000

// middlewares
app.use(express.json());
app.use(cors());

// default route
app.get('/', (req, res)=>{
    res.send("Default route working")
})

app.listen(PORT, ()=>{
    console.log(`server started on PORT : ${PORT}`)
})
