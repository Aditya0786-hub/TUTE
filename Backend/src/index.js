import dotenv from "dotenv"
// import express  from "express"
import {app} from "./app.js";
import connectDB from "./db/index.js";



dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000, ()=>{
        console.log(`server establised at ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed!!",err)
})