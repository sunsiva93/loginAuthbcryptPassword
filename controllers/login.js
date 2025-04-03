import bcrypt from "bcryptjs"
import { register } from "../model/schema/index.js"


const UserReg = async(req,res)=>{
    try {
        const {username , mail , password} = req.body

        const hashSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password , hashSalt)

        const Data = new register({
            username , 
            mail , 
            password : hashPassword
        })
        const UsersData = await Data.save()
        return res.status(201).json({
            status : true,
            message : "Register Successfully!!!",
            UsersData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status : false,
            message : `registration failed! , ${error.message}`
        })
    }
}

const AllUsers = async(req,res)=>{
    try {
        const getUsers = await register.find()
        return res.status(200).json({
            status : true,
            message : "Fetched all UsersData Successfully!!!",
            getUsers
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status : false,
            message : `Can not get/fetched the user! , ${error.message}`
        })
        
    }
}

export {UserReg , AllUsers}