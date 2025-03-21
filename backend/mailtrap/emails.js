import { client } from "./mailtrap.js";
import { sender } from "./mailtrap.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (userEmail,verificationToken)=>{
    const recipient = [
        {
          email: userEmail,
        }
      ];
      
    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "You are awesome!",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken) ,
            category: "Verifation emails",
          })
        
          console.log("succsess :"+ response)
    } catch (error) {
        console.log("error sending email:" + error.message);
        throw new Error("error sending email")
    }
}


