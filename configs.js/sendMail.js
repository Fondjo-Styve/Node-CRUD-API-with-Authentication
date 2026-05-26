import nodemailer from 'nodemailer';
import 'dotenv/config'
export const sendMail=async (email,subject,htmlContent)=>{
    
    const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.NODE_EMAIL_USER,
        pass:process.env.NODE_EMAIL_SENDER_PASSWORD
    },
    timeout:10000
});

try {
    const info=await transporter.sendMail({
        from:`Node CRUD <${process.env.NODE_EMAIL_USER}>`,
        to:email,
        subject:subject,
        html:htmlContent
    });

    return info;
} catch (error) {
    console.error("Mail error:",error);
    throw new Error('Email delivery failed');
 } 
}
