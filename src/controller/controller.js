const nodemailer=require('nodemailer')
const sendgriTransporter=require('nodemailer-sendgrid-transport')


const transporter=nodemailer.createTransport(sendgriTransporter({
    auth:{
        api_key:'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'
    }
}))


exports.sendEmailToSubscriber=()=>{
    transporter.sendMail({
        to:'sardar.uzair12@gmail.com',
        from:'uzairkhurshid12@gmail.com',
        subject:'New Product Arrival',
        html:'<h1>New Product</h1><br><h4>an Amazing product has been arrived at our site go and check it out click the link below</h4><br> '
    })
}

