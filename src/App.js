import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signOut, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { awsConfig } from './aws-config';
import LoginPage from './components/LoginPage';
import Portal from './components/Portal';
import FloatingChatButton from './components/FloatingChatButton';
import ChatWindow from './components/ChatWindow';
import './App.css';

// Configure Amplify
Amplify.configure(awsConfig);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      // Get user attributes from JWT token
      const idToken = session.tokens?.idToken;
      const attributes = idToken?.payload;
      
      setUser({
        email: attributes?.email || '',
        name: attributes?.name || 'Student',
        studentId: attributes?.['custom:student_id'] || 'S1001'
      });
      setIsLoggedIn(true);
    } catch (err) {
      console.log('No user logged in');
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setUser(null);
      setIsChatOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="App loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          <Portal user={user} onLogout={handleLogout} />
          <FloatingChatButton onClick={toggleChat} />
          {isChatOpen && (
            <ChatWindow 
              user={user}
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;