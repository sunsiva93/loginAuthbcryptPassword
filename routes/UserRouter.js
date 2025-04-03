import express from "express"
import { AllUsers, UserReg } from "../controllers/index.js"

const UserRouter = express.Router()

UserRouter.get("/user" , AllUsers)
UserRouter.post("/register" , UserReg)

export  {UserRouter}