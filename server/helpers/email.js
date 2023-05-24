import nodemailer from "nodemailer";

export const fn_email_create_account = async (datos) => {
  const { email, name, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"Udemy MERN - Admin Mobile" <account@updemy_mern.com>',
    to: email,
    subject: "Udemy MERN - Cheackout youe account!",
    text: "Cheackout youe account Udemy MERN",
    html: `<p>Hi: ${name} Cheackout youe account Udemy MERN</p>
      <p>Your account is ready, click in the link for confirm!: 
  
      <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Checkout account</a>
      
      <p>if not you create this account, forgot this email!</p>     
      
      `,
  });
};
export const fn_email_forgot_password = async (datos) => {
  const { email, name, token } = datos;
  
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"Udemy MERN - Admin Mobile" <account@updemy_mern.com>',
    to: email,
    subject: "Udemy MERN - Restart your password",
    text: "Restart your password",
    html: `<p>Hi: ${name} you was restart password?</p>
    
        <p>Fallow the next link for restart your password: 
    
        <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Restart Password</a>
        
        <p>if not is you, forgot this email!</p>
        
        
        `,
  });
};
