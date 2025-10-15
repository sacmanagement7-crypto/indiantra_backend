import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true,          // mandatory field
        enum: ["Individual", "Company", "Partnership"], // must match frontend values
        default: "Individual",   // default value
    }
    ,
    gst: {
        type: String,
        required:true, // GST sirf company ke liye required
        unique: true,
        // trim: true,
        // match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/ // basic GSTIN regex
    },

    // Address Info
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    // Bank Info
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifsc: { type: String, required: true },
    branch: { type: String, required: true },

    // Shop Images
    shopLogo: { type: String },
    shopBanner: { type: String },
    shopPhoto: { type: String },

    // Documents
    idProof: { type: String },
    addressProof: { type: String },
    panCard: { type: String },
    gstCertificate: { type: String },
    cancelledCheque: { type: String },
    bankPassbook: { type: String },

    // Sample Product Images
    sampleProductImage1: { type: String },
    sampleProductImage2: { type: String },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "suspended"], // allowed values
        default: "pending", // default value
        required: true
    },

    reasonForRejection: {
        type: String
    }

}, {
    timestamps: true
})

vendorSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

vendorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


export const Vendor = mongoose.model("Vendor", vendorSchema);