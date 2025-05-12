import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
// import subcriptionrouter from "./routes/subscription.routes.js"
// import videoRouter from "./routes/video.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"

//declaring routes

app.use("/api/v2/users", userRouter)
// app.use("/api/v1/subscription", subcriptionrouter )
// app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/playlist", playlistRouter)







// http://localhost:8000/api/v1/users/register
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
  
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
      errors: err.errors || [],
      data: null
    });
  });

export { app }