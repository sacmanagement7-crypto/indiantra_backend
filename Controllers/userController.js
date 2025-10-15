import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 📌 Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "⚠️ All fields are required" });
    }

    const alreadyExist = await User.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({ message: "❌ Email already registered" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
      message: "🎉 Registration successful. Welcome aboard!",
    });
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

// 📌 Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "⚠️ Email & password are required" });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        token: generateToken(user._id),
        addresses:user.addresses,
        message: "✅ Login successful. Welcome back!",
      });
    } else {
      res.status(401).json({ message: "❌ Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

export const getAllUsers = async (req,res)=>{
  try {
    const user = await User.find({}).sort({ createdAt: -1 })

    if(!user){
      res.status(400).json({  message: "Unable to fetch User" });
    }
    res.status(200).json({user:user})
  } catch (error) {
    res.status(500).json({  message: "🚨 Server error. Please try again later." })
  }
}

// 📌 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json({ ...user._doc, message: "✅ User profile fetched successfully" });
    } else {
      res.status(404).json({ message: "❌ User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

// 📌 Update Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
        message: "✅ Profile updated successfully",
      });
    } else {
      res.status(404).json({ message: "❌ User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

// 📌 Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "🔑 Password updated successfully" });
    } else {
      res.status(400).json({ message: "❌ Old password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

// 📌 Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "❌ No account found with this email" });

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "🔐 Password Reset Request",
      html: `<p>Hello ${user.name},</p>
             <p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link will expire in 10 minutes.</p>`,
    });

    res.json({ message: "📧 Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

// 📌 Reset Password
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "❌ Reset token is invalid or expired" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "🎉 Password reset successful. You can now log in" });
  } catch (error) {
    res.status(500).json({ message: "🚨 Server error. Please try again later." });
  }
};

export const addAddress = async (req,res) =>{
  try {
    const userId = req.user._id;
    const newAddress = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If new address is default, unset old default
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({ message: "Address added", addresses: user.addresses });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params; // URL se addressId
    const updatedData = req.body; // body se naye fields

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Address find karo
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Agar naya address default hai, to purane default ko unset karo
    if (updatedData.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    // Address fields update karo
    Object.assign(address, updatedData);

    await user.save();

    res.status(200).json({ message: "Address updated", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params; // URL se addressId aayega

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Address delete karo
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    address.deleteOne(); // mongoose subdoc method
    await user.save();

    res.status(200).json({ message: "Address removed", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if address exists
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Reset all addresses
    user.addresses.forEach(addr => (addr.isDefault = false));

    // Set this one as default
    address.isDefault = true;

    await user.save();

    res.status(200).json({ message: "Default address updated", addresses: user.addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("❌ getAddress error:", error);
    res.status(500).json({ message: error.message });
  }
};
