# AI-Powered Chatbot for Student Services

A React-based frontend application for my Final Year Project that provides an AI-powered chatbot interface for student services. The application uses **AWS Amplify, Amazon Cognito, Amazon Lex V2, AWS Lambda, and DynamoDB** to deliver a fully functional, production-ready student services assistant.

## ✨ Features

### 🔐 AWS Cognito Authentication
- Secure user sign-up with email verification
- Login with email and password
- Custom user attributes (`student_id`, `name`, `email`)
- Session persistence across browser refreshes
- Password requirements: Min 8 chars with uppercase, lowercase, numbers, and special characters
- Identity Pool for temporary AWS credentials

### 📚 Student Portal Dashboard
- Personalized welcome with student name and ID
- Quick access service cards:
  - Course Registration
  - Library Services
  - Financial Services
  - Academic Records
  - Housing Services
  - Career Services
- Logout functionality

### 🤖 AI Chatbot Interface (Amazon Lex V2)
- **Floating chat button** in bottom-right corner
- **Quick action suggestions** with clickable intent buttons
- **Real-time conversation** with Amazon Lex bot
- **Message formatting** with line breaks and proper text wrapping
- **Typing indicator** with animation
- **Message timestamps**
- **Student context** passed automatically to Lambda functions

### 🎯 Working Lex Intents

1. **RegisterCourseIntent**
   - Register for courses by course ID (e.g., "Register for CS101")
   - Validates course capacity
   - Prevents duplicate registrations
   - Updates DynamoDB in real-time

2. **LibraryHoursIntent**
   - Get library operating hours
   - Returns formatted schedule

3. **GetAvailableCoursesIntent**
   - Lists all available courses
   - Shows course details and capacity

4. **ViewRegisteredCoursesIntent**
   - View student's enrolled courses
   - Shows current registration status

5. **UnregisterCourseIntent**
   - Drop/unregister from a course
   - Updates enrollment counts

6. **WelcomeIntent**
   - Greeting and welcome messages
   - Initial bot interaction

7. **CancelIntent**
   - Cancel current operation
   - Built-in intent

8. **FallbackIntent**
   - Handles unrecognized inputs
   - Built-in intent

9. **QnAIntent** (Configured, awaiting Bedrock integration)
   - General questions about programs
   - Future: AI-powered knowledge base

### 💾 AWS Backend Architecture

**Amazon Lex V2 Bot:**
- Bot Name: `StudentServiceBot`
- Region: `us-east-1`
- Intents: RegisterCourse, LibraryHours, GetAvailableCourses, ViewRegisteredCourses, UnregisterCourse, Welcome, Cancel, QnA, Fallback

**AWS Lambda Function:**
- Function: `StudentChatbotLexHandler`
- Receives `student_id` from session attributes
- Validates and processes course registrations
- Reads/writes to DynamoDB

**Amazon DynamoDB:**
- **Students Table** - Student profiles (PK: student_id, GSI: email-index)
- **Courses Table** - Available courses (PK: course_id)
- **Registrations Table** - Student enrollments (PK: registration_id, GSI: student-index, course-index)

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- AWS Account with configured services (Cognito, Lex, Lambda, DynamoDB)

### 1. Install Dependencies
```bash
cd student-chatbot
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with your AWS credentials:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your actual AWS resource IDs:

```env
# AWS Configuration - DO NOT COMMIT
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-client-id
REACT_APP_IDENTITY_POOL_ID=your-identity-pool-id
REACT_APP_LEX_BOT_ID=your-bot-id
REACT_APP_LEX_BOT_ALIAS_ID=your-bot-alias-id
REACT_APP_LEX_REGION=us-east-1
```

**Note:** 
- The `.env` file is already in `.gitignore` to prevent accidentally committing secrets
- All AWS configuration is now loaded from environment variables
- The `aws-config.js` file uses `process.env` to load these values
- You must restart the dev server (`npm start`) after changing `.env`

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## 📖 Usage

### Login
Use one of the demo accounts:
- **Email:** `alice.johnson@school.edu`
- **Password:** `Test123!`
- **Student ID:** S1001

### Using the Chatbot

1. Click the floating chat button (💬) in the bottom-right corner
2. Use **quick action buttons** or type your message:
   - 📚 "Register for a course"
   - 📋 "View my registered courses"
   - 🔍 "What courses are available?"
   - 📖 "Library hours"

### Example Queries
- "What are the library hours?"
- "Register for CS101"
- "Show me available courses"
- "What courses am I registered for?"
- "Unregister from CS202"
- "I want to take AI301"

## 🏗️ Project Structure

```
src/
├── App.js                     # Main app with auth state management
├── App.css                   # Global styles + loading screen
├── index.js                  # Entry point
├── aws-config.js             # AWS configuration (uses env variables)
├── .env                      # Environment variables (NOT in git)
├── .env.example              # Template for environment setup
├── components/
│   ├── LoginPage.js         # Sign up, login, verification UI
│   ├── LoginPage.css        
│   ├── Portal.js            # Student dashboard
│   ├── Portal.css           
│   ├── FloatingChatButton.js # Chat toggle button
│   ├── FloatingChatButton.css
│   ├── ChatWindow.js        # Main chat interface with Lex integration
│   ├── ChatWindow.css       # Includes suggestion buttons styling
│   ├── MessageInput.js      # Message input component
│   └── MessageInput.css     
└── services/
    └── chatbotService.js    # Amazon Lex V2 SDK integration
```

## 🔒 Security Best Practices

### Environment Variables
All AWS credentials and configuration are stored in the `.env` file:
- `REACT_APP_USER_POOL_ID` - Cognito User Pool identifier
- `REACT_APP_USER_POOL_CLIENT_ID` - Cognito app client ID (sensitive)
- `REACT_APP_IDENTITY_POOL_ID` - Identity pool for AWS credentials (sensitive)
- `REACT_APP_LEX_BOT_ID` - Lex bot identifier
- `REACT_APP_LEX_BOT_ALIAS_ID` - Lex bot alias
- `REACT_APP_LEX_REGION` - AWS region

**Important:**
- ✅ `.env` is in `.gitignore` (never committed to Git)
- ✅ Use `.env.example` as a template for new setups
- ✅ All values loaded via `process.env` in `aws-config.js`
- ⚠️ If credentials are exposed, rotate them immediately in AWS Console
- 🔄 Restart `npm start` after any `.env` changes

### What to Keep Private
**Most sensitive:**
- `REACT_APP_USER_POOL_CLIENT_ID` - Allows authentication operations
- `REACT_APP_IDENTITY_POOL_ID` - Grants temporary AWS credentials

**Moderately sensitive:**
- `REACT_APP_USER_POOL_ID` - Identifies your user pool
- `REACT_APP_LEX_BOT_ID` - Identifies your Lex bot
- `REACT_APP_LEX_BOT_ALIAS_ID` - Bot version identifier

**Best Practice:** Keep all configuration in `.env` for easy environment switching (dev/staging/prod)

## 🔧 AWS Configuration Details

### Cognito User Pool Settings
- Sign-in: Email only
- Required attributes: `email`, `name`
- Custom attribute: `custom:student_id` (String, 5-10 chars)
- Auto-verified attributes: email
- Password policy: Min 8 chars, uppercase, lowercase, numbers, special chars

### Cognito Identity Pool
- Authenticated role has `AmazonLexRunBotsOnly` policy
- Provides temporary credentials for frontend to call Lex

### Lambda IAM Permissions
- `AmazonDynamoDBFullAccess`
- Lambda invoke permission from Lex

## 📊 Sample Data

### Test Users (10 total)
| Name | Email | Student ID | Password |
|------|-------|------------|----------|
| Alice Johnson | alice.johnson@school.edu | S1001 | Test123! |
| Brian Smith | brian.smith@school.edu | S1002 | Test123! |
| Carla Lee | carla.lee@school.edu | S1003 | Test123! |

### Available Courses (8 total)
- **CS101** - Introduction to Programming
- **CS202** - Data Structures and Algorithms
- **IT201** - Networking Fundamentals
- **CY101** - Introduction to Cybersecurity
- **AI301** - Artificial Intelligence
- **DB250** - Database Systems
- **DS201** - Introduction to Data Science
- **WEB220** - Web Development

## 🔄 How It Works

### Architecture Flow
```
User (React App)
  ↓ [Cognito Authentication]
AWS Amplify
  ↓ [Lex SDK with Identity Pool credentials]
Amazon Lex V2 Bot
  ↓ [Passes student_id in sessionAttributes]
AWS Lambda Function
  ↓ [Business logic & validation]
Amazon DynamoDB
  ↓ [Stores/retrieves data]
Response → User
```

### Course Registration Flow
1. User clicks "Register for a course" or types "Register for CS101"
2. Lex extracts `CourseID` slot
3. Lex confirms with user
4. User confirms → Lambda function triggered
5. Lambda receives `student_id` from session attributes
6. Lambda validates:
   - Course exists?
   - Has available capacity?
   - Student not already registered?
7. If valid → Creates registration record → Updates enrolled count
8. Returns success message with course details

## 🎨 Styling & Customization

### Color Scheme
- Primary gradient: `#667eea` to `#764ba2`
- Background: `#f5f7fa`
- Text: `#333`
- Borders: `#e1e5e9`

### Responsive Design
Fully responsive for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### Common Issues

**"No credentials available" error:**
- Check `.env` file exists and contains correct values
- Restart dev server after changing environment variables
- Verify Identity Pool configuration in AWS Console
- Ensure authenticated role has `AmazonLexRunBotsOnly` policy
- Confirm user is logged in via Cognito

**Environment variables not loading:**
- Must restart `npm start` after changing `.env`
- Variable names must start with `REACT_APP_`
- Check `.env` file is in project root (not in `src/`)

**Lex not responding:**
- Verify bot is published and alias is active
- Check Lambda function has correct permissions
- Confirm bot ID and alias ID in `aws-config.js`
- Review CloudWatch logs for Lambda errors

**Registration fails:**
- Check DynamoDB tables exist
- Verify Lambda has DynamoDB permissions
- Confirm student exists in Students table
- Check course capacity hasn't been reached

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📦 Dependencies

```json
{
  "@aws-amplify/auth": "^6.17.0",
  "@aws-sdk/client-lex-runtime-v2": "^3.934.0",
  "aws-amplify": "^6.15.8",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-scripts": "^5.0.1"
}
```

## 📄 License

This project is for educational purposes as part of a Final Year Project.

## 🙏 Acknowledgments

Built with AWS services including Amplify, Cognito, Lex V2, Lambda, and DynamoDB.

---

**Made with ❤️ for Final Year Project 2025**
