export const welcomeEmailTemp = (user, logo) => {
  const ctaButton =
    user?.role === "user"
      ? `
        <a href="${process.env.APP_URL || '#'}"
          style="background-color: #4cb4fd;
                 color: white;
                 padding: 12px 28px;
                 border-radius: 6px;
                 display: inline-block;
                 text-decoration: none;
                 font-weight: bold;
                 margin-top: 25px;">
          Explore Feed
        </a>
      `
      : `
        <a href="${process.env.APP_URL ? process.env.APP_URL + '/create' : '#'}"
          style="background-color: #4cb4fd;
                 color: white;
                 padding: 12px 28px;
                 border-radius: 6px;
                 display: inline-block;
                 text-decoration: none;
                 font-weight: bold;
                 margin-top: 25px;">
          Start Creating
        </a>
      `;

  const roleContent =
    user?.role === "user"
      ? `
        <div style="margin-top: 20px; text-align: left;">
          <h3 style="color: #4cb4fd;">Your Role: User</h3>
          <ul style="line-height: 1.8; padding-left: 18px; color: #444;">
            <li>Watch posts, blogs, and video content.</li>
            <li>Like, share, and engage with creators.</li>
            <li>Follow your favorite creators and stay updated.</li>
            <li>Enjoy a personalized social feed.</li>
          </ul>
        </div>
      `
      : `
        <div style="margin-top: 20px; text-align: left;">
          <h3 style="color: #4cb4fd;">Your Role: Creator</h3>
          <ul style="line-height: 1.8; padding-left: 18px; color: #444;">
            <li>Create and publish posts, blogs, and videos.</li>
            <li>Grow your audience and engage with followers.</li>
            <li>Access analytics to track performance.</li>
            <li>Collaborate with brands and boost visibility.</li>
          </ul>
        </div>
      `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Winku</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">

      <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #ddd;">

        <div style="display: flex; flex-direction: column; align-items: center; background-color: #4cb4fd; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
          <img src="${logo}" alt="Winku Logo" style="max-width: 100px; height: auto; margin-bottom: 15px;" />
          <p style="margin-bottom: 0px;">Welcome to Winku!</p>
        </div>

        <div style="padding: 25px; line-height: 1.8; text-align: center;">
          <p>Hello <strong>${user?.fullname}</strong>,</p>
          <p>We're excited to have you join the Winku community!</p>
          <p>You're all set to explore features, connect with others, and enjoy a seamless social experience built just for you.</p>

          <div style="margin: 25px 0; display: inline-block; background: #eef2ff; border-left: 4px solid #4cb4fd; padding: 15px 20px; border-radius: 6px; color: #4cb4fd; font-size: 18px; font-weight: bold;">
            Welcome aboard, ${user?.fullname}!
          </div>

          ${roleContent}

          <!-- CTA BUTTON -->
          ${ctaButton}

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            If you have any questions, our support team is always here to help.
          </p>
        </div>

        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #ddd;">
          <p>&copy; ${new Date().getFullYear()} Winku. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

