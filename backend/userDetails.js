const mongoose=require("mongoose");

const userDetailsSchema =new mongoose.Schema(
{
    user:String,
    email:String,
    phoneNo:String
},
{
    collation:"userInfo",
}
);

mongoose.model("userInfo",userDetailsSchema);