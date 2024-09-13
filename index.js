const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./routes/user")
const app = express();

// env configure
dotenv.config()

app.use("/user", router)

//mongodb connection
mongoose.connect("mongodb://127.0.0.1:27017/NodeJs", {})
.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
}
)

//server running
app.listen(process.env.PORT, () =>{
    console.log(`server is running on ${process.env.PORT}`);
})