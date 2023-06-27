const express = require('express')
const app = express()
const cors = require('cors');
const tasks = require('./routes/tasks')
const connnectDB = require('./db/connect')
require('dotenv').config()

//middleware
app.use(express.static('./public'))
app.use(express.json()) // it passes data sent into req.body

//cors middleware
app.use(cors({
    origin: 'http://localhost:3000'
  }));  

//routes
app.use('/api/v1/tasks', tasks)

const port = 5000

const start = async() => {
    try {
        await connnectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is listening at port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()
