import mongoose from "mongoose";

const UserSch = new mongoose.Schema({
    username: { type: String, required: true },
    mail: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    createdAtIST: { type: String }
}, { collection: "User" });

UserSch.pre('save', function (next) {
    if (!this.createdAtIST) {
        const istDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        this.createdAtIST = istDate;
    }
    next();
});

const User = mongoose.model("User", UserSch);
export default User;
