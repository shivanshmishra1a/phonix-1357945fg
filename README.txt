PHONIX SALON QUEUE MANAGEMENT SYSTEM
Group: PHONIX
Project: PHONIX Salon Studio

FILES
1. index.html  - Application structure and screens
2. style.css   - Responsive premium styling
3. script.js   - Authentication demo, booking and queue logic
4. README.txt  - This setup guide

HOW TO RUN
1. Extract the project folder.
2. Open the folder in Visual Studio Code.
3. Open index.html in a browser, OR install the Live Server extension in VS Code.
4. Right-click index.html and select "Open with Live Server".
5. Keep the application in the same browser to share LocalStorage demo data between customer and owner screens.

DEMO OWNER LOGIN
Email: owner@phonix.com
Password: admin123

CUSTOMER DEMO
1. Select Customer Login on the home page.
2. Choose "Create an account" and enter your name, email/mobile and password.
3. Sign in and book a service.
4. Open Owner Portal to manage the new booking.
5. Open Live Queue to see the queue display.

FEATURES
- Customer signup and login demo
- Separate owner login
- Seven selectable services with editable prices
- Barber selection and availability management
- Booking tokens (P101, P102, ...)
- Queue position and estimated wait
- Start service, complete service, priority and barber assignment
- Search and status filter
- Live queue display
- LocalStorage persistence

IMPORTANT DEMO NOTES
- This is a front-end college demonstration, not a production booking system.
- Customer passwords and demo records are stored in browser LocalStorage. Do not use real or sensitive passwords.
- Data is stored per browser and device. Customer and owner screens must be opened in the same browser profile to share demo data.
- The app uses online Google Fonts and Unsplash images. Internet access is needed for those remote assets; core layout and functionality still run locally.
- Customer authentication is a demonstration only. There is no server-side security, payment gateway, SMS, or multi-device synchronization.
- To reset demo data, open browser Developer Tools > Application/Storage > Local Storage and clear keys beginning with "phonix_". Also clear session storage if you want to log out.
