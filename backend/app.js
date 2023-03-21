// require('dotenv').config()
const express=require("express");
const app=express();
const mongoose =require("mongoose");
const cors=require('cors')
require("./userDetails");
const User=require('./models/user.model');
const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const mongourl ="mongodb+srv://newproj:newproj@cluster0.fysz8qm.mongodb.net/?retryWrites=true&w=majority"
app.use(cors())
app.use(express.json())

//register part
app.post('/api/register',async(req,res)=>{
    console.log(req.body)

    try{
        const newPassword=await bcrypt.hash(req.body.password,10)
       await User.create({
            name:req.body.name,
            email:req.body.email,
            password:newPassword
         
        })
        res.json({status:'ok'})


    }catch(err){
        
        res.json({status:'error',error:'Duplicate email'})
    }

  
    
})

//logging part

app.post('/api/login ',async(req,res)=>{

    
      const user =  await User.findOne({
            
            email: req.body.email,
           
        
        })

        if(!user){
            return{status:'error',error:'invalid logging'}
        }


        const isPasswordValid =await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(isPasswordValid){
            const token =jwt.sign(
                {
                    name:user.name,
                    email:user.email,
                },
                'secret123'
            )
            return res.json({status:'ok',user:token})
        }else{
            return res.json({status:'error',user:false})
        }

        

})


app.get('/api/quote ',async(req,res)=>{
    const token=req.headers['x-access-token']
    
    try{
        const decoded=jwt.verify(token,'secret123')
        const email=decoded.email
        const user=await User.findOne({email:email})
        // return res.json{{status:'ok',quote:user.quote}}
    }catch(error){
        console.log(error)
        res.json({status:'error',error:'invalid token'})

    }

    
   
})

app.post('/api/quote ',async(req,res)=>{
    const token=req.headers['x-access-token']
    
    try{
        const decoded=jwt.verify(token,'secret123')
        const email=decoded.email
        await User.updateOne(
            {email:email},
            {$set:{quote:req.body.quote}}
            )
        return res.json({status:'ok'})
    }catch(error){
        console.log(error)
        res.json({status:'error',error:'invalid token'})

    }

    
   
})



//conncet mongo db
// mongoose.set("strictQuery",false);
mongoose.connect(mongourl,{
    useNewUrlParser:true,
    // useUnifiedTopology:true
})
.then(()=>{
    console.log("database conncetion is ready");
})
.catch((error)=>{
    console.log(error);
})


app.use(express.json());

app.listen(5000,()=>{
    console.log("server is starting");
});

//making api
app.post("/post",async(req,res)=>{
    console.log(req.body);
    const{data}=req.body;

    try{
        if(data=="adarei"){
            res.send({status:"ok"})
        }else{
            res.send({status:"user not found"})
        }

    }catch(error){
        res.send({status:"something went wrong try again"})
    }

   


});

const user=mongoose.model("userInfo");

// app.post("/register",async(req,res)=>{
//     const (user,email,phoneNo)=req.body;
    
//     try {
        
//     } catch (error) {
        
//     }
// })
