import { Contact } from "../Models/contactModel.js";

export const addContact = async(req,res)=>{
  try{
      const {name,email,phone,subject,message} = req.body;
      const contact = await Contact.create({
        name,
        email,
        phone,
        subject,
        message
      })

      res.status(201).json({message:"Contact Form is Successfully Submitted"});
  }catch(error){
      res.status(500).json({message:"Internal Server Error"})
  }
}

export const getAllContact = async(req,res)=>{
    try {
        const contacts = await Contact.find({})
        res.status(200).json({contacts});
    } catch (error) {
         res.status(500).json({message:"Internal Server Error"});
    }
}