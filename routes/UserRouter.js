import express from "express"
import { AllUsers, Profile, UserLogin, UserReg } from "../controllers/index.js"
import authMiddleware from "../middleware/authMiddleware.js"

const UserRouter = express.Router()

UserRouter.get("/alluser" , AllUsers)
UserRouter.get("/profile" , authMiddleware , Profile)
UserRouter.post("/register" , UserReg)
UserRouter.post("/login" , UserLogin)
export  {UserRouter}