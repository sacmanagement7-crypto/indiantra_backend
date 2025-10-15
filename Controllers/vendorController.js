import { Vendor } from "../Models/vendorModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}


export const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "⚠️ Email & password are required" });
        }

        const vendor = await Vendor.findOne({ email: email });

        if(!vendor){
            return res.status(400).json({message:"Email is not valid"});
        }

        const isMatch = await vendor.matchPassword(password);
        if (vendor && isMatch && (vendor.status === 'approved' || vendor.status === 'suspended')) {
            res.status(200).json({
                id: vendor._id,
                email: vendor.email,
                name: vendor.name,
                token: generateToken(vendor._id),
                status:vendor.status,
                message: "✅ Login successful. Welcome back!",
            });
        } else {
            res.status(401).json({ message: "❌ Invalid email or password" });
        }

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Create/Register a new vendor
export const createVendor = async (req, res) => {
    try {
        const {
            name, email, phone, password,
            shopName, businessType, gst,
            address, city, state, pincode,
            bankName, accountHolderName, accountNumber, ifsc, branch
        } = req.body;

        const existingVendor = await Vendor.findOne({ email });

        if (existingVendor) return res.status(400).json({ message: "Email already registered" });
        
        // Assign uploaded files
        const newVendor = new Vendor({
            name, email, phone, password,
            shopName, businessType, gst,
            address, city, state, pincode,
            bankName, accountHolderName, accountNumber, ifsc, branch,
            shopLogo: req.files['shopLogo']?.[0]?.path,
            shopBanner: req.files['shopBanner']?.[0]?.path,
            shopPhoto: req.files['shopPhoto']?.[0]?.path,
            idProof: req.files['idProof']?.[0]?.path,
            addressProof: req.files['addressProof']?.[0]?.path,
            panCard: req.files['panCard']?.[0]?.path,
            gstCertificate: req.files['gstCertificate']?.[0]?.path,
            cancelledCheque: req.files['cancelledCheque']?.[0]?.path,
            bankPassbook: req.files['bankPassbook']?.[0]?.path,
            sampleProductImage1: req.files['sampleProductImage1']?.[0]?.path,
            sampleProductImage2: req.files['sampleProductImage2']?.[0]?.path
        });

        await newVendor.save();
        res.status(201).json({ message: "Vendor registered successfully", vendor: newVendor });
    } catch (error) {
        console.error("Error creating vendor:", error);
        res.status(500).json({ message: "Failed to register vendor", error: error.message });
    }
};


// Get all vendors
export const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json({ vendors });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ message: "Failed to fetch vendors", error: error.message });
    }
};

// Get vendor by ID
export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });
        res.status(200).json({ vendor });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ message: "Failed to fetch vendor", error: error.message });
    }
};

// Update vendor info
export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedVendor) return res.status(404).json({ message: "Vendor not found" });

        res.status(200).json({ message: "Vendor updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ message: "Failed to update vendor", error: error.message });
    }
};

// Approve or reject vendor
export const changeVendorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reasonForRejection } = req.body;



        if (!["pending", "approved", "rejected", "suspended"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const vendor = await Vendor.findById(id);
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        vendor.status = status;
        if (status === "rejected") vendor.reasonForRejection = reasonForRejection || "Not specified";
        await vendor.save();

        res.status(200).json({ message: `Vendor ${status} successfully`, vendor });
    } catch (error) {
        console.error("Error changing vendor status:", error);
        res.status(500).json({ message: "Failed to update vendor status", error: error.message });
    }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVendor = await Vendor.findByIdAndDelete(id);
        if (!deletedVendor) return res.status(404).json({ message: "Vendor not found" });
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({ message: "Failed to delete vendor", error: error.message });
    }
};
// ✅ Check vendor registration status
export const checkVendorStatus = async (req, res) => {
  try {
    const { id } = req.params; // or you could use vendor ID from token if logged in

    if (!id) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const vendor = await Vendor.findById(id).select("name email shopName status reasonForRejection");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Vendor status fetched successfully",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        shopName: vendor.shopName,
        status: vendor.status,
        reasonForRejection: vendor.reasonForRejection || null,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor status:", error);
    res.status(500).json({ message: "Failed to fetch vendor status", error: error.message });
  }
};

