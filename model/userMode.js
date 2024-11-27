import {Schema,model,Types} from "mongoose";

const userSchema=new Schema(
    {
        userName:{
            type:String,
            required:true,
        },
        role:{
            type:Boolean,
            default:false
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
    
        
    },
    {
        timestamps: true 
    }
)

const UserModel=model("users",userSchema)



export default UserModel