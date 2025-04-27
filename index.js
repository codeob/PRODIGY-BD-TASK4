require('dotenv').config()
const express = require('express')
const app = express();
const Port = process.env.PORT || 5000

// middleware
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send('Hello World')
})

// server
app.listen(Port,"localhost" ,() => {
    console.log(`Server is running on port http://localhost:${Port}`)
})