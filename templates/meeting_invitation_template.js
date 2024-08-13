export const meetingInvitationTemplate = ({ title, date, time, meetingtype, description }) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Meeting Invitation</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
              .details {
                  padding: 20px;
                  background: #F9F9F9; /* Very Light Gray */
                  border-radius: 10px;
                  border: 1px solid #E1E1E1; /* Light Gray */
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              }
              .details p {
                  margin: 15px 0;
                  font-size: 16px;
                  color: #333333; /* Dark Gray */
                  display: flex;
                  align-items: center;
              }
              .details i {
                  color: #16A085; /* Teal */
                  margin-right: 10px;
              }
              .details strong {
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
                  <h1>Meeting Invitation</h1>
                  <div class="company-name">Bridgeon Solutions</div>
              </div>
              <div class="details">
                  <p><i class="fas fa-calendar-day"></i><strong>Title:</strong> ${title}</p>
                  <p><i class="fas fa-calendar-alt"></i><strong>Date:</strong> ${date}</p>
                  <p><i class="fas fa-clock"></i><strong>Time:</strong> ${time}</p>
                  <p><i class="fas fa-briefcase"></i><strong>Meeting Type:</strong> ${meetingtype}</p>
                  <p><i class="fas fa-align-left"></i><strong>Description:</strong> ${description}</p>
              </div>
              <div class="footer">
                  <p>Copyright © 2023-2024, Bridgeon Solutions LLP Privacy and Policy</p>
              </div>
          </div>
      </body>
      </html>
    `;
  };
  