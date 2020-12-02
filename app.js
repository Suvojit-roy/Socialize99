const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express();
const PORT=process.env.PORT || 5000;
const {MONGOURI}=require('./config/keys.js')

// app.use(cors());

mongoose.connect(MONGOURI,{ useUnifiedTopology: true ,useNewUrlParser: true})
mongoose.connection.on('connected',()=>{
    console.log("Connected")
})
mongoose.connection.on('error',()=>{
    console.log("err connecting")
})

require('./Models/user')
require('./Models/post')
require('./Models/user')
 
app.use(express.json())
app.use(require('./Routes/auth'))
app.use(require('./Routes/post'))
app.use(require('./Routes/user'))



// app.get('/',(req,res)=>{
//     console.log('Home')
//     res.send("Hello Hi");
// })

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('pathheroku login -I')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,(req,res)=>{
    console.log("Working ")
})

// jaooizLFBQaPuabh





