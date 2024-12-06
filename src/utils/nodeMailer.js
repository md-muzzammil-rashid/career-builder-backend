import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another SMTP service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  port: 465
});

export const mailSender =  async (from, to, name, subject, message) => {

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `New Message from ${name}: ${subject}`,
    html: generateEmailTemplate({senderEmail: from, subject, senderName:name, message}),

  };

  try {
    const send = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', send);
    return send
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send email');
}
};

function generateEmailTemplate({
    senderName, 
    senderEmail, 
    subject, 
    message, 
    productName = 'Career Builder'
  }) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Message</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
          }
          .email-container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              padding: 30px;
          }
          .header {
              background-color: #3498db;
              color: white;
              text-align: center;
              padding: 15px;
              border-radius: 8px 8px 0 0;
          }
          .content {
              margin-top: 20px;
          }
          .sender-info {
              background-color: #f9f9f9;
              border-left: 4px solid #3498db;
              padding: 15px;
              margin: 20px 0;
          }
          .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <h1>${productName} Message Notification</h1>
          </div>
          
          <div class="content">
              <h2>${subject}</h2>
              
              <div class="sender-info">
                  <strong>From:</strong> ${senderName}<br>
                  <strong>Email:</strong> ${senderEmail}<br><br>
                  <strong>Message</strong> <br>
                  <p>${message}</p>
              </div>
              
          </div>
          
          <div class="footer">
              <p>Sent via ${productName} - Connecting People Seamlessly</p>
          </div>
      </div>
  </body>
  </html>
    `;
  }
  
