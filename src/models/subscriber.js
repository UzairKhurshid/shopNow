const mongoose=require('mongoose')
const validator=require('validator')

const subscriberSchema=new mongoose.Schema({ 
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not a valid email')
            }
        }
    }
})

const Subscriber=mongoose.model('Subscriber',subscriberSchema)
module.exports=Subscriber 