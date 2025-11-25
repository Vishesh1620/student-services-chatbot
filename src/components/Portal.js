import React from 'react';
import './Portal.css';

const Portal = ({ onLogout, user }) => {
  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="header-content">
          <h1>Student Portal Dashboard</h1>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="portal-main">
        <div className="welcome-section">
          <h2>Welcome{user?.name ? `, ${user.name}` : ''}</h2>
          <p>Access all your academic and administrative services in one place.</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <h3>📚 Course Registration</h3>
            <p>Register for courses and manage your academic schedule</p>
          </div>
          
          <div className="service-card">
            <h3>📖 Library Services</h3>
            <p>Check library hours, search catalog, and manage reservations</p>
          </div>
          
          <div className="service-card">
            <h3>💰 Financial Services</h3>
            <p>View tuition fees, payment options, and financial aid</p>
          </div>
          
          <div className="service-card">
            <h3>🎓 Academic Records</h3>
            <p>Access transcripts, grades, and academic history</p>
          </div>
          
          <div className="service-card">
            <h3>🏠 Housing Services</h3>
            <p>Manage dormitory applications and housing arrangements</p>
          </div>
          
          <div className="service-card">
            <h3>💼 Career Services</h3>
            <p>Find internships, job opportunities, and career guidance</p>
          </div>
        </div>
        
        <div className="chatbot-info">
          <div className="info-card">
            <h3>💬 AI Assistant Available</h3>
            <p>
              Need help? Click the chat button in the bottom-right corner to get instant assistance 
              from our AI-powered student services chatbot. Ask about library hours, course registration, 
              fees, and much more!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portal;
