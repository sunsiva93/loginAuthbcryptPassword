import mongoose from "mongoose";

const MONGODB_URL= process.env.MONGODB_URI || "mongodb://localhost:27017/login"
const dbConn = async()=>{
    try {
        await mongoose.connect(MONGODB_URL)
        .then(()=>{
            console.log(`db is connected : ${MONGODB_URL}`);
        })
        .catch(err => console.log("something went wrong" , err.message))
        
    } catch (error) {
        console.log(error);
    }
}
export default dbConn