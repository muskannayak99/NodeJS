const mongoose = require("mongoose");
const { softDeletePlugin } = require("soft-delete-plugin-mongoose")

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, default: "ABCD"},
    email: {type: String, required: true, unique: true, default: "example@gmail.com"},
    countryCode: {type: String, required: true, default: "+91"},
    phoneNumber: {type: String, required: true, unique: true, default: "1234567890"},
    password: {type: String, required: true, default: "12345678"},
    isDeleted: {type: Boolean, default: false},
    deleteAt: {type: Date, default: null}
})
UserSchema.plugin(softDeletePlugin)

const UserModel = mongoose.model("user", UserSchema)

module.exports = UserModel;