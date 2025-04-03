import jwt from "jsonwebtoken"
import { User } from "../model/schema/index.js"

const authMiddleware = async(req,res,next)=>{
    try {
        const token = req.header("Authorization")?.replace("Bearer " , "")
        if (!token) {
            return res.status(401).json({
                status : false,
                message : `Access denied!. No token provided!.`
            })
        }
        const decode =  jwt.verify(token , process.env.JWT_SECRET)
        const user =  await User.findById(decode.id)
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found!",
            });
        }
        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({
            status : false,
            message : `Authentication failed! , ${error.message}`
        })
    }
}

export default authMiddleware