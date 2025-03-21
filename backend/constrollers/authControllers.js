import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../util/generateAndSetCookie.js"
import { sendVerificationEmail ,sendWelcomeEmail} from "../mailtrap/emails.js";

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
      verificationTokenExpiresAt: {$gt:Date.now()}
     });
     
      if(!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
          user: null
        });
      }

    if (user.verificationToken == code) {
      await User.updateOne({ isVerified: true });

      user.verificationToken = undefined;
      user.verificationTokenExpiresAt =undefined;

      await user.save();

      await sendWelcomeEmail(user.email,user.name);
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
  console.log(req.url)
}

export const login = (req, res) => {
  console.log(req.url)
}

