const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.get('/', (req, res) => {
    return res.send('Hello World everyone!')
})

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log(err)
    })
    
app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})


