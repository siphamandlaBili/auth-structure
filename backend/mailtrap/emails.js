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
      template_uuid: "70dd55d9-48c5-40b2-bc86-6ae71afb1b53",
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
