import { HttpStatus } from "../httpStatus.js";
import dataModel from "../model/dataModel.js";





export const handleSearch=async(req,res,next)=>{



    try{


    console.log(req.query.value)

    let searchingData=req.query.value
   
    let searchh=searchingData.replace(/["',]/g, '').replace(/[.,"'*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
   
    const regex = new RegExp(searchh, 'i')
   

    let result = await dataModel.find({ header:{$regex:regex} });

    if(result.length==0){
        result=await dataModel.find({ dates:{$regex:regex} });
    }

    

    if (result.length === 0) {
        result = await dataModel.find({ addresses: {$regex:regex} });
    }
    console.log(searchh)
    console.log(result)

   
   


    

  return res.status(HttpStatus.OK).json({data:result})


}catch(error){
    next(error)
}



}