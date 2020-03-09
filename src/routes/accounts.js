const express=require('express')
const router=new express.Router()
const User=require('../models/account')
const auth=require('../expressMiddleware/auth')


router.get('/login',(req,res)=>{
    if(req.session.email){
        res.redirect('/dashboard')
    }
    else{
        res.render('login')
    }
   
})
router.post('/login',async(req,res)=>{
    
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        
        const role=user.role
        req.session.email=req.body.email
        req.session.role=role
        if(role=="admin"){
            res.render('dashboard',{
                role:role
            })
        }
        else{  
            res.render('dashboard')
        }
    }catch(e){
        res.render('login',{
            txtEmail:req.body.txtEmail,
            txtPassword:req.body.txtPassword,
            error:e
        }) 
        console.log(e)
    }
})


router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.post('/signup',async(req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        res.render('login',{
            txtEmail:req.body.email,
            txtPassword:req.body.password
        })
        console.log('saved successfully')
    }catch(e){
        console.log(e)
        res.render('signup',{
            Error:'Invalid Data Provided'
        })
    }
})

router.post('/logout',auth,async (req,res)=>{
    try{
        req.session.destroy((err)=>{
            console.log(err)
            res.redirect('/login')
        })
    }catch(e){
        console.log(e) 
    }
})



router.post('/delAccount',auth,async (req,res)=>{
    try{
        const email=req.session.email
        const user=await User.findOneAndDelete({email})
        console.log('successfull')
        res.redirect('/login')
    }catch(e){
        console.log(e) 
    }
})



module.exports=router