import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"    

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb"}))                               // json se kitna data aaega uski limit determine krne ke liye
app.use(express.urlencoded({extended: true, limit: "16kb"}))         //to decode to original url
app.use(express.static("public"))
app.use(cookieParser())                                             //to get the access of users's cookie and uspe CRUD operation perfrom kar ske. 


//import routes
import userRouter from './routes/user.routes.js'

//route declare
app.use("/api/v1/users", userRouter)


export {app}