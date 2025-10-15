import express from "express";
import { createVendor, getVendorById, getVendors ,updateVendor,changeVendorStatus, deleteVendor, vendorLogin, checkVendorStatus} from "../Controllers/vendorController.js";
import upload from "../Config/multer.js";

export const vendorRouter = express.Router();

vendorRouter.post('/login',vendorLogin);

vendorRouter.post('/register', upload.fields([
    { name: "shopLogo" },
    { name: "shopBanner" },
    { name: "shopPhoto" },
    { name: "idProof" },
    { name: "addressProof" },
    { name: "panCard" },
    { name: "gstCertificate" },
    { name: "cancelledCheque" },
    { name: "bankPassbook" },
    { name: "sampleProductImage1" },
    { name: "sampleProductImage2" },
  ]),createVendor);

  vendorRouter.get('/',getVendors);
  vendorRouter.get('/:id',getVendorById);
  vendorRouter.put('/:id',updateVendor);
  vendorRouter.post('/:id',changeVendorStatus);
  vendorRouter.delete('/:id',deleteVendor);
  vendorRouter.get('/status/:id',checkVendorStatus);