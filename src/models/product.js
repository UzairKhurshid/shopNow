const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    avatar:{
        type:Buffer,
        required:true
    },
    nameOfProduct:{
        type:String,
        required:true
    },
    priceOfProduct:{
        type:String,
        required:true,
    },
    blogOfProduct:{
        type:String
    },
    authorName:{
        type:String
    },
    postingDate:{
        type:String
    },
    ownerEmail:{
        type:String,
        required:true,
        ref:'User'
    }
})


const Product=mongoose.model('Product',productSchema)


module.exports=Product