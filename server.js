const express = require ("express")
const cors = require("cors")
const connectDB = require("./config/db")


const app = express()

//Connect database
connectDB()

// Init middleware
app.use(express.json({extended: false}))

//CORS config 
const corsOptions = {
    origin: ['http://localhost:3001'],
    credentials: true,
    optionsSucessStatus: 204
}

app.use(cors(corsOptions))


app.get ("/", (req, res) => {
    res.send("API Running")
})

//Define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))



const PORT = process.env.PORT || 5001
// Grabbing the port from Heroku when deployed and use 5000 when used locally

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))