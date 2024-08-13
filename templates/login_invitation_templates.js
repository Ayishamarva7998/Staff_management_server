export const loginTemplate = (name, role, email, password) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Team</title>
    <style>
              body {
                  font-family: 'Arial', sans-serif;
                  color: #333333; /* Dark Gray */
                  line-height: 1.6;
                  margin: 0;
                  padding: 0;
                  background: #F5F5F5; /* Light Gray */
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background: #FFFFFF; /* White */
                  border: 1px solid #E1E1E1; /* Light Gray */
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background: #34495E; /* Dark Slate Gray */
                  color: #FFFFFF; /* White */
                  padding: 20px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                  border-bottom: 2px solid #2C3E50; /* Slightly Darker Slate Gray */
              }
              .header img {
                  max-width: 100px;
                  margin-bottom: 10px;
                  border-radius: 50%;
                  object-fit: cover;
              }
              .header h1 {
                  margin: 0;
                  font-size: 26px;
                  font-weight: 700;
              }
              .company-name {
                  font-size: 16px;
                  color: #BDC3C7; /* Light Gray */
                  margin-top: 5px;
              }
              .content {
                  padding: 20px;
                  background: #F9F9F9; /* Very Light Gray */
                  border-radius: 10px;
                  border: 1px solid #E1E1E1; /* Light Gray */
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              }
              .content p {
                  margin: 15px 0;
                  font-size: 16px;
                  color: #333333; /* Dark Gray */
                  display: flex;
                  align-items: center;
              }
              .content i {
                  color: #16A085; /* Teal */
                  margin-right: 10px;
              }
              .content strong {
                  color: #34495E; /* Dark Slate Gray */
              }
              .footer {
                  text-align: center;
                  padding: 15px;
                  background: #FFFFFF; /* White */
                  border-radius: 0 0 10px 10px;
                  border-top: 1px solid #E1E1E1; /* Light Gray */
              }
              .footer p {
                  margin: 0;
                  font-size: 14px;
                  color: #777777; /* Medium Gray */
              }
              @media (max-width: 600px) {
                  .container {
                      padding: 10px;
                  }
                  .header h1 {
                      font-size: 22px;
                  }
                  .details p {
                      font-size: 14px;
                  }
              }
          </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUsj969OxAXIdz0f33l_yF02ZyMY5aLHclIA&s" alt="Bridgeon Solutions Logo">
                  <div class="company-name">Bridgeon Solutions</div>
        </div>
        <div class="content">
            <p>Hello ${name},</p>
            <p>Welcome to the team as our new ${role}. We're excited to have you on board!</p>
            <p>We have created your profile with the following details:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please keep this information secure and ensure your login details are confidential.</p>
            <p>Best regards,<br>Bridgeon Solutions Team</p>
        </div>
        <div class="footer">
            <p>Copyright © 2023-2024, Bridgeon Solutions LLP Privacy and Policy</p>
        </div>
    </div>    
</body>
</html>
`;
