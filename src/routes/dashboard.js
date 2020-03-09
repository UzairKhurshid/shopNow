const express=require('express')
const router=new express.Router();
const User=require('../models/account')
const Contact=require('../models/userContactUs')
const auth=require('../expressMiddleware/auth')




router.get('/dashboard',auth,(req,res)=>{
    const role=req.session.role
    if(role=="admin"){
        res.render('dashboard',{
            role:role
        })
    }
    else{
        res.render('dashboard')
    }
})




////////////////role required to display these admin related routes ////////////////////////

router.get('/addAccount',auth,(req,res)=>{
    const role=req.session.role
    
        res.render('Accounts/addAccount',{
            role:role
        })
    
})
router.post('/addAccount',auth,async(req,res)=>{
    const user=new User(req.body)
    const role=req.session.role
    try{
        await user.save()
            res.render('dashboard',{
                role:role
            })
        
        console.log('saved successfully')
    }catch(e){
        console.log(e)
            res.render('Accounts/addAccount',{
                role:role,
                Error:'Invalid Data Provided'
            })
    }
})
router.get('/Accounts',auth,async(req,res)=>{
    const role=req.session.role
    const accounts=await User.find()
    res.render('Accounts/Accounts',{
        role:role,
        accounts:accounts
    })
})
router.get('/deleteAccount',auth,async(req,res)=>{
    const role=req.session.role
    const accounts=await User.find()
    res.render('Accounts/deleteAccount',{
        role:role,
        accounts:accounts
    })
})

router.post('/deleteAccount',auth,async(req,res)=>{
    const role=req.session.role
    const email=req.body.email
    try{
        
        await User.deleteOne({email})
        res.render('dashboard',{
            role:role
        })
        console.log('Deleted successfully')
    }catch(e){
        console.log(e)
        res.render('Accounts/deleteAccount',{
            role:role
        })
    }
})

router.get('/contact',auth,async(req,res)=>{
    const role=req.session.role
    try{
        const contacts=await Contact.find()
        res.render('contacts',{
            role:role,
            contact:contacts
        })
    }catch(e){
        res.redirect('/dashboard')
    }
})


router.get('/profile',auth,async(req,res)=>{
    const role=req.session.role
    const email=req.session.email
    try{
        const user=await User.findOne({email})
        if(role=="admin"){    
            res.render('profile',{
                username:user.username,
                email:user.email,
                rolehbs:user.role,
                role:role 
            })    
        }
        else{    
            res.render('profile',{
                username:user.username,
                email:user.email,
                rolehbs:user.role 
            })
        }
    }catch(e){
        res.redirect('/dashboard')
    }
})

router.post('/updateProfile',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const email=req.session.email
    
    try{

        const user=await User.findOne({email})
        updates.forEach((update) => user[update] = req.body[update] )
        await user.save()
    
        console.log('successfull')
        res.redirect('/dashboard')
    }catch(e){
        console.log(e)
    }
})



module.exports=router