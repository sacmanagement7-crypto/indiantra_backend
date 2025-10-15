import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
    },
    phone:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    }
},{timestamps:true});

export const Contact = mongoose.model("Contact",contactSchema);