const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../expressMiddleware/auth')


router.get('/login',(req,res)=>{
    res.render('login')
})



router.get('/check',(req,res)=>{
    res.render('check')
})
router.post('/check',async(req,res)=>{
    
    const user=new User(req.body)
    
    try{
        console.log(user)
        await user.save()
        req.session.name=req.body.username
        res.render('index')
        console.log(req.session.name)
    }catch(e){
        console.log(e)
        res.send('Error')
    }
})

module.exports=router