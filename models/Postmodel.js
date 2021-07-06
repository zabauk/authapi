const mongoose=require('mongoose')

const PostSchema=new mongoose.Schema({
   title:{type:String, required:true},
    body:{type:String, required:true},
    date:{type:Date, default:Date.now},
    photo:{type:String}
})
module.exports=mongoose.model('posts', PostSchema)