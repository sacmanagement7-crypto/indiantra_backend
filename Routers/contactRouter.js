import express from "express";
import { addContact, getAllContact } from "../Controllers/contactController.js";

export const contactRouter = express.Router();

contactRouter.get('/contact',getAllContact);
contactRouter.post('/contact',addContact);