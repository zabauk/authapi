require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')

const app=express()
//use json middleware
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Server running')
})

//make database connection
mongoose.connect(process.env.DB_LINK, {
    useNewUrlParser:true, useUnifiedTopology:true
}, (err, client)=>{
    if(err)console.log(err)
    console.log('Connection established successfully')
})

app.listen(process.env.SERVER_PORT || 5000, console.log('Server running on port 3000'))