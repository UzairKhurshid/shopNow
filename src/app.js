require('./db/mongoose')
const userRoute=require('./routes/user')
const webSiteRouter=require('./routes/website')
const express=require('express')
const path=require('path')
const hbs=require('hbs')
const bodyParser=require('body-parser')

const app=express()
const port=process.env.PORT || 3000

const publicDirectory=path.join(__dirname,'../public')
const viewDirectory=path.join(__dirname,'../temp/views')
const partialsDirectory=path.join(__dirname,'../temp/partials')
const session=require('express-session')
const mongoStoreSession=require('connect-mongodb-session')(session) //use to dtore sessions in db

const dbStore=new mongoStoreSession({
    uri:'mongodb://127.0.0.1:27017/application2',
    collection:'sessions'
});

app.use(express.static(publicDirectory))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret:'secret key encrypt session',
    resave:false,
    saveUninitialized:false,
    store:dbStore
}))

app.set('view engine','hbs')
app.set('views',viewDirectory)
hbs.registerPartials(partialsDirectory)



app.use(userRoute)
app.use(webSiteRouter)

app.listen(3000,()=>{
    console.log('Server is up and running on port'+port)
})