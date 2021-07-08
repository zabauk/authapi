require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const User=require('./routes/userRouter')
const PostRouter=require('./routes/PostRouter')
const app=express()
//use json middleware
app.use(express.json())

//use cors
app.use(cors())

//set uploads folder static
app.use('/uploads', express.static('uploads'))

//use router middleware
app.use('/api', User)

//use post router middleware
app.use('/api', PostRouter)

//get home page
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

app.listen(process.env.SERVER_PORT || 5000, console.log(`Server running on port ${process.env.SERVER_PORT}`))