import { client } from "./mailtrap.js";
import { sender } from "./mailtrap.js";
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

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
            category: "Verification emails",
          })
        
          console.log("success :"+ response)
    } catch (error) {
        console.log("error sending email:" + error.message);
        throw new Error("error sending email")
    }
}

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [
    {
      email: email,
    },
  ];

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "26134add-d45e-45fd-a662-1028e12eaaa0",
      template_variables: {
        company_info_name: "Psycad UJ",
        name: name,
        company_info_address: "UJ APB Company",
        company_info_city: "Johannesburg",
        company_info_zip_code: "2058",
        company_info_country: "South Africa",
      },
    });
    console.log("Welcome email sent successfully"+ response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Error sending email");
  }
};

export const forgotPasswordSend= async (email,link)=>{
  const recipient = [
    {
      email,
    }
  ];
  
try {
    const response = await client.send({
        from: sender,
        to: recipient,
        subject: "Reset link",
        html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",link) ,
        category: "reset password emails",
      })
    
      console.log("success :"+ response)
} catch (error) {
    console.log("error sending email:" + error.message);
    throw new Error("error sending email")
}
}

export const sendResetSuccess = async (email)=>{
  const recipient = [
    {
      email,
    }
  ];
  
try {
    const response = await client.send({
        from: sender,
        to: recipient,
        subject: "password changed",
        html:PASSWORD_RESET_SUCCESS_TEMPLATE ,
        category: "reset password success emails",
      })
    
      console.log("success :"+ response)
} catch (error) {
    console.log("error sending email:" + error.message);
    throw new Error("error sending email")
}
}

