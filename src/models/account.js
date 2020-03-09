const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({

    username:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not a valid email')
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    avatar:{
        type:Buffer,
        required:true
    } 
})

userSchema.virtual('products',{
    ref:'Product',
    localField:'email',
    foreignField:'ownerEmail' 
})
userSchema.virtual('cartItem',{
    ref:'Cart',
    localField:'email',
    foreignField:'ownerEmail' 
})


userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})

    if(!user){
        throw new Error('user with this email does not exists')
    }
    const checkPassword = await bcrypt.compare(password,user.password)

    if(!checkPassword){
        throw new Error('Wrong Password')
    }

    return user
}

userSchema.pre('save',async function(next){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
        }

    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User