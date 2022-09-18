require('dotenv').config()
const express = require('express')
const app = express()
const cors = require ('cors')
const bodyParser = require('body-parser')
const mySqlConnection = require('./config/mysql')
const usersRoutes = require('./routes/users')


const port = process.env.PORT

app.listen(port, () => {
    console.log(`i am listening on ${port}`)
})

app.use(bodyParser.json())
app.use(cors())
app.use(usersRoutes)


mySqlConnection.connect(err => {
    if (err) throw err.stack
    // connected!
    console.log('successfully connected: ' , mySqlConnection.threadId)
  })






app.get('/', (req, res) => {
    
    res.status(200).send({
        status: "error",
        message: "Welcome to HD Group of companies",
        data: []
    })

})
