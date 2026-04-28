import React from 'react';
import './futureupd.css';

const FutureUpdate = () => {
  return (
    <div className="coming-soon-container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="glass-card">
        <div className="content">
          <span className="badge">New Release</span>
          <h1 className="title">Feature Coming <span className="highlight">Soon</span></h1>
          <p className="description">
            We're currently building something amazing to enhance your experience. 
            Our team is working hard to bring this feature to life. Stay tuned!
          </p>
          
          <div className="loader-container">
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
            <span className="progress-text">Development in progress...</span>
          </div>

          <button className="notify-btn" onClick={() => alert('Thanks for your interest!')}>
            Get Notified
          </button>
        </div>
      </div>
    </div>
  );
};

export default FutureUpdate;