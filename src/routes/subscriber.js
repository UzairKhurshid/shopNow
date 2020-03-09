const express=require('express')
const router=new express.Router()
const Subscriber=require('../models/subscriber')

router.post('/subscribe',async(req,res)=>{
    const subscriber=new Subscriber(req.body)
    try{
        await subscriber.save()
        console.log('subscribe Successfull')
        res.redirect('/')
    }catch(e){
        console.log(e)
    }
})


module.exports=router