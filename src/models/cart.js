const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({

        productID: {
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        ownerEmail:{
            type:String,
            required:true,
            ref:'User'
        } 
   
})

const Cart=mongoose.model('Cart',cartSchema)
module.exports=Cart