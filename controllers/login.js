import bcrypt from "bcryptjs"
import { User } from "../model/schema/index.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import moment from "moment-timezone"

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username, mail: user.mail }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const UserReg = async(req,res)=>{
    try {
        const {username , mail , password} = req.body
        const hashSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , hashSalt)

        const Data = new User({
            username , 
            mail , 
            password : hashedPassword
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
        const user = await User.findOne({mail})
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
        const token = generateToken(user)

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

const ForgotPassword = async (req, res) => {
    try {
        const { mail } = req.body;
        const user = await User.findOne({ mail });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Mail not found in database!"
            });
        }

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; 
        await user.save();

        return res.status(200).json({
            status: true,
            message: "Password reset token generated!",
            resetToken
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error: ${error.message}`
        });
    }
};


const ResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.resetPasswordExpire < Date.now()) {
            return res.status(400).json({
                status: false,
                message: "Invalid or expired reset token!"
            });
        }

        const hashSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, hashSalt);

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            {
                password: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpire: undefined,
                lastActivity: moment().tz("Asia/Kolkata").toDate(),
            },
            { new: true }
        );
        const expiryInIST = moment(updatedUser.resetPasswordExpire)
            .tz("Asia/Kolkata")
            .format("DD/MM/YYYY, h:mm:ss A");
        return res.status(200).json({
            status: true,
            message: "Password reset successfully!",
            updatedUser: {
                ...updatedUser.toObject(),
                resetPasswordExpire: expiryInIST ,
                lastActivity: moment(updatedUser.lastActivity).tz("Asia/Kolkata").format("DD/MM/YYYY, h:mm:ss A"),
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Error: ${error.message}`
        });
    }
};

const AllUsers = async(req,res)=>{
    try {
        const getUsers = await User.find()
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

const getUserById  = async(req,res)=>{
    try {
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status : false,
                message : `Invalid User ID format!`
            })
        }
        const UserInfo = await User.findById(userId)
        if (!UserInfo) {
            console.log(error);
            return res.status(404).json({
                status : false,
                message : `Cannot get/fetched the user! , ${error.message}`
            })
        }
        return res.status(200).json({
            status : true,
            message : `Fetched UsersData : ${userId} Successfully!!!`,
            UserInfo
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status : false,
            message : `Can't get User Info! , ${error.message}`
        })
    }
}

export {UserReg , AllUsers , UserLogin , Profile , getUserById  , ForgotPassword , ResetPassword}