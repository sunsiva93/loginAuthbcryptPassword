import bcrypt from "bcryptjs"
import { register } from "../model/schema/index.js"
import jwt from "jsonwebtoken"

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

const UserLogin = async(req,res)=>{
    try {
        const {mail, password} = req.body
        const user = await register.findOne({mail})
        if (!user) {
            console.log(`mail not found`);
            return res.status(404).json({
                status : false,
                message : `mail not found in database!`
            })
        }
        const checkPassword = await bcrypt.compare(password , user.password)
        if (!checkPassword) {
            console.log(`invalid password!`);
            return res.status(401).json({
                status: false,
                message: "Invalid password!",
            })  
        }

        const token = jwt.sign({ id: user._id, username: user.username, mail: user.mail }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            status: true,
            message: "Login successful!",
            token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status : false,
            message : `login failed! , ${error.message}`
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
        return res.status(404).json({
            status : false,
            message : `Can not get/fetched the user! , ${error.message}`
        })
        
    }
}

const Profile = async(req,res)=>{
    try {
        const user = req.user
        return res.status(200).json({
            status: true,
            message: "User profile fetched successfully!",
            user,
        })
        
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : `Error fetching user profile! , ${error.message}`
        })
    }
}
export {UserReg , AllUsers , UserLogin , Profile}