export const sendForgotPasswordEmail = (resetPasswordUrl, logo) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
  
      <div className="container" style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #ddd;">

        <div className="header" style="display: flex; flex-direction: column; align-items: center; background-color: #4cb4fd; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
          <img src="${logo}" alt="Winku Logo" style="max-width: 100px; height: auto; margin-bottom: 15px;" />
          <p style="margin-bottom: 0px;">Reset Your Password</p>
        </div>
      
        <div className="content" style="padding: 25px; line-height: 1.8; text-align: center;">
          <p>Hello,</p>
          <p>We received a request to reset your password. To proceed, please click the link below:</p>
          <a href="${resetPasswordUrl}" target="_self" style="display: inline-block; background-color: #4cb4fd; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 6px; font-weight: bold; margin-top: 20px;">Reset Your Password</a>
          <p style="font-size: 13px; margin-top: 10px; color: #666;">(If you didn’t request a password reset, please ignore this email.)</p>
        </div>
      
        <div className="footer" style="background-color: #f4f4f4; padding: 15px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #ddd;">
          <p>&copy; ${new Date().getFullYear()} Winku. All rights reserved.</p>
        </div>
      
      </div>
    </body>
    </html>
  `;
};
