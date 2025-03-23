import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken =  (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
      return res.status(400).json({success:false,message:"unauthorised access - token invalid"})
    }
  
    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET)
  
      if(!token){
          return res.status(400).json({success:false,message:"unauthorised access - token invalid"})
      }
  
      req.userId = decoded.userId;
      next();
    } catch (error) {
      
    }
}