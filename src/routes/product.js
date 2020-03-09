const express=require('express')
const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const sendgriTransporter=require('nodemailer-sendgrid-transport')
const Product=require('../models/product')
const User=require('../models/account')
const Subscriber=require('../models/subscriber')
const authFun=require('../expressMiddleware/auth')
const router=new express.Router()

const transporter=nodemailer.createTransport(sendgriTransporter({
    auth:{
        api_key:'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'
    }
}))

router.get('/products',authFun,async(req,res)=>{
    const email=req.session.email
    try{
        const user=await User.findOne({email})
        
        if(user.role=="admin"){
            const products=await Product.find()
            
            res.render('products/products',{
                products:products,
                role:user.role
            })
        }
        else{
            await user.populate('products').execPopulate()
        
            res.render('products/products',{
                products:user.products
            })
        }
        
    }catch(e){
        console.log(e)
    }
})  


router.get('/addProduct',authFun,(req,res)=>{
    const role=req.session.role
    if(role=="admin"){
        res.render('products/addProduct',{
            role:role
        })
    }
    else{
        res.render('products/addProduct')
    }
})

router.post('/addProduct',authFun,async(req,res)=>{
    const email=req.session.email
    const product=new Product(req.body) 
    
    product.ownerEmail=email
    try{
        await product.save()
        res.redirect('/addProduct')

        const subscribers=await Subscriber.find()
        
        subscribers.forEach(function(element)  {
            transporter.sendMail({
                to:element.email,
                from:'uzairkhurshid12@gmail.com',
                subject:'New Product Arrival',
                html:'<h1>New Product</h1><br><h4>an Amazing product has been arrived at our site go and check it out click the link below</h4><br><a href="localhost:3000">shopNow</a> '
            })
        });
        console.log('successfull')
    }catch(e){
        console.log(e)
    }
})

 


router.get('/addBlogProduct',authFun,(req,res)=>{
    const role=req.session.role
    if(role=="admin"){
        res.render('products/addProduct',{
            role:role,
            blog:"blogPost"
        })
    }
    else{
        res.render('products/addProduct')
    }
})

router.post('/addBlogProduct',authFun,async(req,res)=>{
    const email=req.session.email
    const product=new Product(req.body) 
    
    product.ownerEmail=email
    try{
        
        await product.save()

        res.redirect('/addProduct')

        const subscribers=await Subscriber.find()
        
        subscribers.forEach(function(element)  {
            transporter.sendMail({
                to:element.email,
                from:'uzairkhurshid12@gmail.com',
                subject:'New Product Arrival',
                html:'<h1>New Product</h1><br><h4>an Amazing product has been arrived at our site go and check it out click the link below</h4><br><a href="localhost:3000">shopNow</a> '
            })
        });
        console.log('successfull')
    }catch(e){
        console.log(e)
    }
})



router.post('/editProduct',authFun,async(req,res)=>{
    
    const role=req.session.role
    const email=req.session.email
    const productID=req.body.productID
    
    try{
        const product=await Product.findById({_id:mongoose.Types.ObjectId(productID)})

        console.log('successfull')
        if(role=="admin"){    
            res.render('products/editProduct',{
                role:role,
                productID:productID,
                nameOfProduct:product.nameOfProduct,
                priceOfProduct:product.priceOfProduct,
                ownerEmail:product.ownerEmail
            })
        }
        else{    
            res.render('products/editProduct',{
                productID:productID,
                nameOfProduct:product.nameOfProduct,
                priceOfProduct:product.priceOfProduct,
                ownerEmail:product.ownerEmail
            })
        }
    }catch(e){
        console.log(e)
    }
})

router.post('/deleteProduct',authFun,async(req,res)=>{
    
    const email=req.session.email
    console.log(req.body)
    const productID=req.body.productID
    console.log(productID)
    try{
        await Product.findByIdAndDelete({_id:mongoose.Types.ObjectId(productID)})
        console.log('successfull')
        res.redirect('/products')
    }catch(e){
        console.log(e)
    }
})


router.post('/updateProduct',authFun,async(req,res)=>{
    
    const email=req.session.email
    const productID=req.body.productID
    const avatar=req.body.avatar
    const nameOfProduct=req.body.nameOfProduct
    const priceOfProduct=req.body.priceOfProduct
    
    try{
        await Product.updateOne({_id:mongoose.Types.ObjectId(productID)},{
            avatar:avatar,
            nameOfProduct:nameOfProduct,
            priceOfProduct:priceOfProduct
        })

        console.log('successfull')
        res.redirect('/dashboard')
    }catch(e){
        console.log(e)
    }
})



module.exports=router