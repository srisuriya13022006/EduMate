import React, { useState } from 'react';
import { MessageSquare, FileText, Brain, BookOpen, User, Sparkles } from 'lucide-react';
import './Navbar.css';
import { useNavigate, useLocation } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'pdfchat', label: 'PDF Chat', icon: MessageSquare, path: '/' },
    { id: 'qpgenerator', label: 'QP Generator', icon: FileText, path: '/futureupdate' },
    { id: 'quiz', label: 'Quiz', icon: Brain, path: '/quiz-settings' },
    { id: 'resources', label: 'Resources', icon: BookOpen, path: '/resources' }
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-brand">
        <div className="logo-container" onClick={() => navigate("/")}>
          <Sparkles className="logo-icon" size={28} />
          <span className="logo-text">EduMate</span>
        </div>
      </div>

      {/* Center nav */}
      <div className="navbar-center">
        <div className="nav-items">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile */}
      <div className="navbar-profile">
        <div className="profile-container">
          <div className="profile-avatar">
            <User size={20} />
          </div>
          <div className="profile-status" />
        </div>
      </div>
    </nav>
  );
}
