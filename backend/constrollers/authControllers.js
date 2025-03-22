import { User } from "../models/UserModel.js";
import { generateTokenAndSetCookie } from "../util/generateAndSetCookie.js"
import { forgotPasswordSend, sendVerificationEmail, sendWelcomeEmail,sendResetSuccess } from "../mailtrap/emails.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {

  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error("all fields are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("user exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(10000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    })

    await user.save();

    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        ...user._doc,
        password: null
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message, success: false })
  }
}

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
        user: null
      });
    }

    if (user.verificationToken == code) {
      await User.updateOne({ isVerified: true });

      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();

      await sendWelcomeEmail(user.email, user.name);
      return res.status(200).json({ success: true, message: "user verified successfully" })
    }
    else {
      throw new Error("user verification failed");
    }

  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }

}

export const logout = (req, res) => {
  const token = req.cookies.token
  console.log(token)
  if (token) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "logged out successfully" });
  } else {
    res.status(200).json({ success: true, message: "already logged out" });
  }

}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({ success: false, message: "user credentials invalid" })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "user credentials invalid" })
    }

    if (user && isPasswordValid) {
      generateTokenAndSetCookie(res, user.id);
      user.lastLogin = new Date();
      user.save();
      res.status(200).json({ success: true, message: `welcome ${user.name}`, user })
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.error.message })
  }
}


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({ success: false, message: "user doesnt exist" });
    } else {
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      user.resetPasswordToken = resetToken;

      await user.save();

      const link = `${process.env.CLIENT_URL}/api/auth/forgot-password/${resetToken}`
      await forgotPasswordSend(email, link);
      return res.status(200).json({ success: true, message: `reset password link has been sent to ${email}` });
    }


  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export const resetPassword =async (req,res)=>{
const {token} = req.params;
const {password} =req.body;

console.log(token,password)
  try {
    const user = await User.findOne({resetPasswordToken:token,resetPasswordExpiresAt:{$gt :Date.now()}});

    if(!user){
      return res.status(400).json({ success: false, message:"imvalid token cannot reset password" });
    }

    const hashedPassword = await bcrypt.hash(password,10);
    user.password = hashedPassword;
    user.save();

    await sendResetSuccess(user.email);
    return res.status(200).json({ success: true, message:"password succsessfully changed" });
  } catch (error) {
    
  }
}