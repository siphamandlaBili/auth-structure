import {User} from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import {generateTokenAndSetCookie} from "../util/generateAndSetCookie.js"

export const signup = async (req,res)=>{
  console.log(req.body)
   const {name,email,password} = req.body;

   try {
    if(!name || !email || !password){
      throw new Error("all fields are required");
    }

    const userExists = await User.findOne({email});

    if(userExists){
      throw new Error("user exists");
    }

    const hashedPassword = await bcrypt.hash(password,12);
    const verificationToken = Math.floor(10000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password:hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000    
    })

    await user.save();

    generateTokenAndSetCookie(res,user._id);

    res.status(201).json({
      success:true,
      message: "user ctreated succesfully",
      user:{
       ...user._doc,
       password:null
      }
    })
   } catch (error) {
    res.status(400).json({message:error.message,success:false})
   }
 }
export const logout = (req,res)=>{
    console.log(req.url)
}

export const login = (req,res)=>{
    console.log(req.url)
  }
