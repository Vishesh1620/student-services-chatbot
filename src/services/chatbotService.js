// Mock responses for the chatbot
// This file contains keyword-to-response mappings for the AI chatbot
// Replace this with actual Amazon Lex integration when ready

const mockResponses = {
  // Library services
  'library hours': 'The library is open from 8 AM - 8 PM, Monday through Friday, and 10 AM - 6 PM on weekends.',
  'library': 'Our library offers study spaces, computer labs, and a vast collection of books and digital resources. What would you like to know about the library?',
  'books': 'You can search for books using our online catalog. Would you like help finding a specific book or information about borrowing policies?',
  
  // Course registration
  'register course': 'You have been registered for Computer Science 101. Registration confirmation has been sent to your email.',
  'course registration': 'Course registration is now open for the upcoming semester. You can register online through the student portal.',
  'courses': 'We offer a wide range of courses across different departments. What subject are you interested in?',
  'schedule': 'Your current class schedule shows 5 courses this semester. Would you like to see specific details or make changes?',
  
  // Financial services
  'tuition': 'Your tuition balance for this semester is $3,500. Payment is due by the end of the month.',
  'fees': 'Current semester fees include tuition, lab fees, and student services. Total: $3,750. Would you like a detailed breakdown?',
  'payment': 'You can pay your fees online through the student portal or at the registrar office. We accept credit cards, bank transfers, and cash.',
  'financial aid': 'Financial aid applications are processed by our Financial Aid office. Current status: Application under review.',
  
  // Housing services
  'housing': 'Housing applications are now open for next semester. We have dormitories and shared apartments available.',
  'dormitory': 'Dormitory rooms are available in various configurations. Single rooms: $800/month, Shared rooms: $500/month.',
  'room': 'Your current room assignment is Building A, Room 205. Need to make any changes or report maintenance issues?',
  
  // Academic records
  'grades': 'Your current GPA is 3.7. You have 4 As and 1 B this semester. Keep up the good work!',
  'transcript': 'Official transcripts can be requested through the Registrar office. Digital copies are available in your student portal.',
  'gpa': 'Your current cumulative GPA is 3.7 out of 4.0.',
  
  // General services
  'help': 'I can help you with course registration, library services, tuition payments, housing, grades, and general student services. What do you need assistance with?',
  'contact': 'You can contact student services at (555) 123-4567 or email support@university.edu. Office hours: 9 AM - 5 PM, Monday-Friday.',
  'hours': 'Student services office hours are 9 AM - 5 PM, Monday through Friday. The library has extended hours until 8 PM.',
  
  // Career services
  'career': 'Career services offers job placement assistance, resume reviews, and interview preparation. Would you like to schedule an appointment?',
  'jobs': 'Current job openings include internships in technology, business, and healthcare. Check the career portal for details.',
  'internship': 'Internship opportunities are available in various fields. Visit career services to explore options and get application guidance.',
  
  // Default responses
  'default': "I'm here to help with student services! You can ask me about library hours, course registration, tuition payments, housing, grades, and more. What would you like to know?",
  'greeting': "Hello! I'm your AI student services assistant. I'm here to help you with any questions about courses, library, payments, housing, and more!",
  'thanks': "You're welcome! Is there anything else I can help you with today?",
  'bye': "Goodbye! Feel free to reach out anytime you need assistance with student services. Have a great day!"
};

// Function to find the best response based on user input
export const getChatbotResponse = (userMessage) => {
  return new Promise((resolve) => {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      resolve(mockResponses.greeting);
      return;
    }
    
    // Check for thanks
    if (message.includes('thank') || message.includes('thanks')) {
      resolve(mockResponses.thanks);
      return;
    }
    
    // Check for goodbye
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      resolve(mockResponses.bye);
      return;
    }
    
    // Look for keyword matches
    for (const keyword in mockResponses) {
      if (message.includes(keyword)) {
        resolve(mockResponses[keyword]);
        return;
      }
    }
    
    // If no specific match found, return default response
    resolve(mockResponses.default);
  });
};

// Function to add new responses (for easy customization)
export const addMockResponse = (keyword, response) => {
  mockResponses[keyword] = response;
};

// Function to get all available keywords (for debugging/testing)
export const getAvailableKeywords = () => {
  return Object.keys(mockResponses);
};

// Amazon Lex V2 integration
import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';
import { fetchAuthSession } from '@aws-amplify/auth';
import { lexConfig } from '../aws-config';

export const sendToAmazonLex = async (message) => {
  try {
    const session = await fetchAuthSession();
    const credentials = session.credentials;

    if (!credentials) throw new Error("No credentials available");

    // Extract Cognito user attributes
    let userAttributes = {};
    if (session.tokens && session.tokens.idToken) {
      userAttributes = session.tokens.idToken.payload;

      // Example attributes typically present:
      // userAttributes.email
      // userAttributes.name
      // userAttributes["custom:student_id"]
    }

    // Build session attributes for Lex
    const sessionAttributes = {
      cognito_username: userAttributes["cognito:username"] || "guest",
      email: userAttributes.email || "",
      name: userAttributes.name || "",
      student_id: userAttributes["custom:student_id"] || "guest"
    };

    const lexClient = new LexRuntimeV2Client({
      region: lexConfig.region,
      credentials: credentials,
    });

    const lexParams = {
      botId: lexConfig.botId,
      botAliasId: lexConfig.botAliasId,
      localeId: lexConfig.localeId,
      sessionId: sessionAttributes.student_id, // Student ID as session
      text: message,
      sessionState: {
        sessionAttributes,
      },
    };

    const command = new RecognizeTextCommand(lexParams);
    const response = await lexClient.send(command);

    if (response.messages?.length > 0) {
      return response.messages.map((m) => m.content).join("\n");
    }

    return "I didn't understand that. Try again?";

  } catch (error) {
    console.error("Error calling Lex:", error);
    throw error;
  }
};


export default { getChatbotResponse, addMockResponse, getAvailableKeywords, sendToAmazonLex };
