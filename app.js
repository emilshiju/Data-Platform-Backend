import express from "express"
import cors from 'cors';
import cron from 'node-cron';


import router from "./route/route.js"
import connectToMongo from "./config/config.js"
import scrapeData from "./controller/scrabData.js";


const app=express()




const allowedOrigins = [
    "http://localhost:5173",
  ];


const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); 
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };


app.use(cors(corsOptions));

//  scrapeData(); 

cron.schedule('0 0 * * *', () => {
    
    // scrapeData();  
});



connectToMongo(()=>{
    console.log("connected succesfully mongo")
})

app.use(express.json());



app.use(router)


app.use((err, req, res, next) => {
  console.error(err); // Log the error

  // Send an appropriate response to the client
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    // Optional: You can add more detailed error info for development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});




app.listen(3000)