import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp, resendSignUpCode, fetchAuthSession, signOut } from '@aws-amplify/auth';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      // Sign out any existing session first
      try {
        await signOut();
      } catch (signOutErr) {
        // Ignore if no user is signed in
      }
      
      await signIn({
        username: email,
        password: password
      });
      
      console.log('Login successful, fetching user data...');
      
      // Get user attributes
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      const attributes = idToken?.payload;
      
      const userData = {
        email: attributes?.email || email,
        name: attributes?.name || 'Student',
        studentId: attributes?.['custom:student_id'] || 'S1001'
      };
      
      console.log('Calling onLogin with:', userData);
      
      // Pass user data to parent
      onLogin(userData);
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.name === 'UserNotConfirmedException') {
        setError('Please verify your email first. Check your inbox.');
        setNeedsVerification(true);
      } else if (err.name === 'NotAuthorizedException') {
        setError('Invalid email or password');
      } else if (err.name === 'UserNotFoundException') {
        setError('User not found. Please sign up first.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim() || !name.trim() || !studentId.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { userId } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: name,
            'custom:student_id': studentId
          }
        }
      });
      
      console.log('Sign up successful:', userId);
      setError('');
      setNeedsVerification(true);
      alert('Sign up successful! Please check your email for a verification code.');
      
    } catch (err) {
      console.error('Sign up error:', err);
      
      if (err.name === 'UsernameExistsException') {
        setError('This email is already registered. Please log in.');
      } else if (err.name === 'InvalidPasswordException') {
        setError('Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.');
      } else {
        setError(err.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      
      alert('Email verified! You can now log in.');
      setNeedsVerification(false);
      setIsSignUp(false);
      setVerificationCode('');
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      alert('Verification code resent! Check your email.');
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
    }
  };

  // Verification Form
  if (needsVerification) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Verify Email</h1>
            <p>Enter the code sent to {email}</p>
          </div>
          
          <form onSubmit={handleVerification} className="login-form">
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="form-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            
            <button type="button" onClick={resendCode} className="link-button">
              Resend Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sign Up Form
  if (isSignUp) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Create Account</h1>
            <p>AI-Powered Student Services</p>
          </div>
          
          <form onSubmit={handleSignUp} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., S1001"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your school email"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, upper/lower/number/special"
                className="form-input"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setIsSignUp(false)} 
              className="link-button"
            >
              Already have an account? Log in
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login Form (Default)
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Student Portal</h1>
          <p>AI-Powered Student Services</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <button 
            type="button" 
            onClick={() => setIsSignUp(true)} 
            className="link-button"
          >
            Don't have an account? Sign up
          </button>
        </form>
        
        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: alice.johnson@school.edu</p>
          <p>Password: Test123!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;