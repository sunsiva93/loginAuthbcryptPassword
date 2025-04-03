import express from "express"
import { AllUsers, ForgotPassword, getUserById, Profile, ResetPassword, UserLogin, UserReg } from "../controllers/index.js"
import authMiddleware from "../middleware/authMiddleware.js"

const UserRouter = express.Router()

UserRouter.get("/alluser" , AllUsers)
UserRouter.get("/profile" , authMiddleware , Profile)
UserRouter.get("/userId/:id" , authMiddleware , getUserById)
UserRouter.post("/register" , UserReg)
UserRouter.post("/login" , UserLogin)
UserRouter.post("/forgot-password" , ForgotPassword)
UserRouter.post("/reset-password/:token" , authMiddleware , ResetPassword)
export  {UserRouter}