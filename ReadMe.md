Welcome to Exhibition Ticketing and Attendance Management System, where you can easily organize events, manage registrations, and book tickets, all with just a few clicks. This system provides a hassle-free experience for both event organizers and attendees, making event management a breeze.

Features 🎯

Event Creation: Create and customize events with ease.
Registration Management: Allow attendees to register for events online.
Ticket Booking: Enable attendees to book tickets for events online.
Email Notifications: Send automated emails for event registrations and bookings, which are sent directly to attendees' email addresses.
Attendee Tracking: Keep track of attendees and monitor check-in and check-out times.
Admin Management: Product managers can add admins that can create and manage events.
Technologies Used
Raect.js: A javaScript library used to build user interfaces.
Tailwind CSS: A utility-first CSS framework for building responsive and customizable user interfaces.
JavaScript: A programming language used for client-side and server-side scripting.
Node.js: A JavaScript runtime environment used for building scalable and efficient server-side applications.
Express: A minimalist web framework for building server-side applications with Node.js.
MongoDB: A NoSQL document-oriented database used for storing and retrieving data.

Architecture
Exhibition Ticketing and Attendance Management Systemis built on a microservice architecture. This allows for scalability, flexibility, and efficient communication between different components of the system. The interactions between client and server take place via API calls, providing a seamless experience for both the organizers and attendees.

🚀 Getting Started (Locally)
Download or clone the repository
You can download the zip file of the repository or use the following command in your terminal to clone the repository:

Navigate to the project's root directory
Once you have downloaded or cloned the repository, navigate to the project's root directory. The project consists of three folders: client, server, and developer.

Install dependencies
Before starting the servers, make sure to install the dependencies by running the command:

npm install
in all the main directory, the frontend folder and backend folder.
Set up environment variables
Before running the servers, you need to set up the following environment variables:

create a .env file in the main directory with these: 

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/Ticketing-System
JWT_SECRET=balex
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

Start the servers
To start the servers, run the following commands:

To run concurrently: npm run fullstack
To run backend individually: nodemon index.js
To run frontend individually: npm run dev
Note: Make sure to follow the exact steps mentioned above to avoid any errors or issues.



,
    "rewrites": [
        {
            "source": "/api/:path*",
            "destination": "https://your-backend-url.onrender.com/api/:path*"
        }
    ]