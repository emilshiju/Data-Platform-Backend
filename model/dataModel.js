import mongoose, {Schema,model,Types} from "mongoose";





const dataSchema=new Schema(
    {
        
        dates: {
            type: String, 
            default:null,
          },
          addresses: {
            type: String, 
            default:null,
          },
          header:{
            type:String,
            default:null,
              trim:true
          },
          url:{
            type:String
          }
          
      },
      {
        timestamps: true, 
      }
)



const dataModel=model('message',dataSchema)

export default dataModel