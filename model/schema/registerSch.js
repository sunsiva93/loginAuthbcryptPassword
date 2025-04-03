import mongoose from "mongoose";

const registerSch = new mongoose.Schema({
    username: { type: String, required: true },
    mail: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true },
    createdAtIST: { type: String }
}, { collection: "User" });

registerSch.pre('save', function (next) {
    if (!this.createdAtIST) {
        const istDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        this.createdAtIST = istDate;
    }
    next();
});

const register = mongoose.model("User", registerSch);
export default register;
