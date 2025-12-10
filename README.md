Weather & COVID-19 Dashboard
Group 11 - Service-Oriented Computing Project
Horizon Campus - ITBIN 2211

👥 Team Members
A.S.N. Wijesinghe (ITBIN-2211-0319)
S.M.F. Shayila (ITBIN-2211-0291)
R.M.K.N. Rathnayake (ITBIN-2211-0273)
📋 Project Overview
A secure client-server web application that displays and aggregates real-time COVID-19 statistics and weather conditions for user-selected countries. Features OAuth 2.0 authentication, API key validation, and MongoDB data persistence.

🚀 Quick Setup Guide
Prerequisites (Install These First)
Node.js (v16+) - Download Here
MongoDB - Choose one:
Local: Download MongoDB
Cloud: MongoDB Atlas (Free)
Git - Download Here
📦 Installation Steps
Step 1: Clone/Download the Project
bash
git clone <your-repo-url>
cd weather-covid-dashboard
Step 2: Install Dependencies
bash
npm install
This will install:

express
mongoose
cors
dotenv
passport
passport-google-oauth20
express-session
Step 3: Get API Keys
A) OpenWeatherMap API Key
Go to https://openweathermap.org/api
Sign up for free account
Go to "API keys" section
Copy your API key
IMPORTANT: Open index.html and replace on Line 214:
javascript
   const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace this!
B) Google OAuth 2.0 Credentials
Go to Google Cloud Console
Create a new project (e.g., "Weather COVID Dashboard")
Enable "Google+ API"
Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
Choose "Web application"
Add Authorized redirect URIs:
   http://localhost:5000/auth/google/callback
Copy your Client ID and Client Secret
C) MongoDB Connection String
Option 1 - Local MongoDB:

mongodb://localhost:27017/weather-covid-db
Option 2 - MongoDB Atlas (Cloud):

Create free account at MongoDB Atlas
Create a cluster (M0 Free tier)
Click "Connect" → "Connect your application"
Copy connection string (looks like):
   mongodb+srv://username:password@cluster.mongodb.net/weather-covid-db
Step 4: Configure Environment Variables
Create a .env file in the root folder:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-covid-db
SESSION_SECRET=my-random-secret-key-xyz123
API_KEY=your-api-key-12345
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:3000
IMPORTANT:

Replace all placeholder values with your actual credentials
The API_KEY must match in both .env AND index.html (Line 213)
Step 5: Start MongoDB (If Using Local)
Windows:

bash
mongod
macOS/Linux:

bash
sudo mongod
MongoDB Atlas: Skip this step (already running in cloud)

Step 6: Run the Application
Terminal 1 - Start Backend:

bash
npm start
You should see:

🚀 Server running on http://localhost:5000
✅ MongoDB Connected Successfully
Terminal 2 - Start Frontend:

Option A - Using Python:

bash
python -m http.server 3000
Option B - Using Node's http-server:

bash
npx http-server -p 3000
Option C - Using VS Code Live Server:

Right-click index.html → "Open with Live Server"
Change port to 3000 in settings
Step 7: Access the Application
Open your browser:

http://localhost:3000
🎯 Testing the Application
1. Login
Click "Login with Google"
Authenticate with your Google account
You'll be redirected back to the dashboard
2. Search Weather & COVID Data
Select a country from dropdown
Click "Get Data"
View weather and COVID-19 statistics
3. Save Data
After viewing data, click "💾 Save to Database"
Data will be stored in MongoDB
4. View Records
Click "🔄 Refresh Records"
See all your previously saved searches
🧪 Testing with Postman
Test 1: Health Check
GET http://localhost:5000/health
Should return: { "status": "OK", "message": "Server is running" }

Test 2: Submit Data (Requires Auth)
First, login via browser to get session cookie.

POST http://localhost:5000/submit

Headers:
Content-Type: application/json
x-api-key: your-api-key-12345
Cookie: connect.sid=<your-session-cookie>

Body:
{
  "country": "Sri Lanka",
  "weather": {
    "temperature": 28.5,
    "humidity": 75,
    "description": "clear sky",
    "windSpeed": 3.5,
    "city": "Colombo"
  },
  "covidStats": {
    "cases": 672345,
    "deaths": 16789,
    "recovered": 650123,
    "active": 5433,
    "todayCases": 25,
    "todayDeaths": 1
  }
}
Test 3: Get Records
GET http://localhost:5000/records

Headers:
x-api-key: your-api-key-12345
Cookie: connect.sid=<your-session-cookie>
📊 Project Structure
weather-covid-dashboard/
├── index.html           # Frontend (HTML + CSS + JS all-in-one)
├── server.js            # Backend (Node.js/Express)
├── package.json         # Dependencies
├── .env                 # Environment variables (create this!)
├── .gitignore          # Git ignore file
└── README.md           # This file
🔐 Security Features
OAuth 2.0 - Google authentication for users
API Key Validation - Application-level security
Session Management - Secure session handling
User Data Isolation - Users only see their own records
Input Validation - Backend validates all data
🐛 Common Issues & Solutions
Issue 1: MongoDB Connection Error
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Start MongoDB with mongod command

Issue 2: Port Already in Use
Error: listen EADDRINUSE: address already in use :::5000
Solution:

bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
Issue 3: OAuth Redirect Error
redirect_uri_mismatch
Solution:

Check Google Console redirect URI is exactly: http://localhost:5000/auth/google/callback
No trailing slash
Must be http (not https) for localhost
Issue 4: API Key Not Matching
Error: Invalid API Key
Solution:

Check .env file has: API_KEY=your-api-key-12345
Check index.html line 213 has same value
Restart server after changing .env
Issue 5: CORS Error
Access to fetch blocked by CORS policy
Solution:

Make sure backend is running on port 5000
Make sure frontend is running on port 3000
Check CORS settings in server.js
📡 API Endpoints
Method	Endpoint	Description	Auth	API Key
GET	/health	Health check	❌	❌
GET	/auth/google	Start OAuth	❌	❌
GET	/auth/google/callback	OAuth callback	❌	❌
GET	/auth/user	Get current user	✅	❌
GET	/auth/logout	Logout	✅	❌
POST	/submit	Save aggregated data	✅	✅
GET	/records	Get user's records	✅	✅
🛠️ Technologies Used
Frontend:

HTML5, CSS3, JavaScript (ES6+)
Fetch API
Backend:

Node.js
Express.js
Passport.js (OAuth)
Mongoose (MongoDB ODM)
Database:

MongoDB
External APIs:

OpenWeatherMap API
disease.sh COVID-19 API
Google OAuth 2.0
📹 Video Demonstration
[Link will be added here]

📚 References
OpenWeatherMap API: https://openweathermap.org/api
disease.sh COVID-19 API: https://disease.sh/docs/
Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
Express.js: https://expressjs.com/
MongoDB: https://docs.mongodb.com/
Passport.js: http://www.passportjs.org/
📝 Notes for Setup on Another PC
Install Node.js, MongoDB, and Git
Clone the repository
Run npm install
Get your own API keys (OpenWeatherMap, Google OAuth)
Create .env file with your credentials
Update index.html with your OpenWeatherMap API key
Start MongoDB
Run npm start for backend
Open index.html in browser with a local server
👨‍💻 Development Team
For questions or issues, contact:

ITBIN-2211-0319@horizoncampus.edu.lk
ITBIN-2211-0291@horizoncampus.edu.lk
ITBIN-2211-0273@horizoncampus.edu.lk
License: Educational Project - Horizon Campus

