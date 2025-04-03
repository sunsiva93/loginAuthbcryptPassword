import mongoose from "mongoose";

const registerSch = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    mail :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
} , {collection : "users" , timestamps : true , type : new Date.now()})

const register = mongoose.model("users" , registerSch)
export default register