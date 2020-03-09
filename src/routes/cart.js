const express=require('express')
const mongoose=require('mongoose')
const User=require('../models/account')
const Cart=require('../models/cart')
const auth=require('../expressMiddleware/auth')
const router=new express.Router()

router.get('/cart',auth, async(req,res)=>{
    const email=req.session.email
    try{
        const user=await User.findOne({email})
        
        await user.populate('cartItem').execPopulate()
        
        res.render('cart',{
            products:user.cartItem  
        })
    }catch(e){
        console.log(e)
    }
})

router.post('/removeFromCart',auth, async(req,res)=>{
    const email=req.session.email
    try{
        
        const cartItemID=req.body.cartItemID
        await Cart.findByIdAndDelete({_id:mongoose.Types.ObjectId(cartItemID)})

        const user=await User.findOne({email})
        await user.populate('cartItem').execPopulate()

        res.render('cart',{
            products:user.cartItem  
        })
    }catch(e){
        console.log(e)
    }
})



module.exports=router