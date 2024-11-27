
import UserModel from "../model/userMode.js"
import { accesToken } from "../services/jwtToken.js"
import { HttpStatus } from "../httpStatus.js"


export const userLogin=async(req,res,next)=>{


    try{


        const {email,password}=req.body.data
        console.log(email,password)

        const response=await UserModel.findOne({email:email,password:password})


        if(response){
            

           let tokenCreated=await accesToken(response.userName,response.email,response._id)

           return res.status(HttpStatus.OK).json({status: true ,token:tokenCreated,userDetails:response})

        }


        return res.status(HttpStatus.UNAUTHORIZED).json({status:false})






    }catch(error){

        next(error)
    }



}


export const userRegister=async(req,res,next)=>{




    try{

        const {name,email,password}=req.body.data
        console.log(req.body.data)


        const response=await UserModel.create({userName:name,email,password})

      
            

            let tokenCreated=await accesToken(response.userName,response.email,response._id)
            console.log("toejn created",tokenCreated)
 
            return res.status(HttpStatus.OK).json({status: true ,token:tokenCreated,userDetails:response})
 
         
        //  return res.status(HttpStatus.UNAUTHORIZED).json({status:false})

         



    }catch(error){

        next(error)
    }



}