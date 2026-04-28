import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, Plus, MessageSquare, File, X } from 'lucide-react';
import './Chat.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Marketing Strategy.pdf', date: '2 hours ago' },
    { id: 2, title: 'Financial Report Q4', date: 'Yesterday' },
    { id: 3, title: 'Project Proposal', date: '3 days ago' }
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 const handleFileUpload = async (e) => {
  const file = e.target.files[0];

  if (!file || file.type !== "application/pdf") {
    alert("Please upload a valid PDF file");
    return;
  }

  setUploadedFile(file);

  // Create UI chat entry immediately
  const newChat = {
    id: Date.now(),
    title: file.name,
    date: "Just now"
  };

  setChatHistory([newChat, ...chatHistory]);
  setActiveChat(newChat.id);
  setMessages([
    {
      type: "system",
      content: `Uploading ${file.name}...`
    }
  ]);

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    // Success message
    setMessages([
      {
        type: "system",
        content: `✅ ${file.name} uploaded and processed successfully. You can now ask questions about this document.`
      }
    ]);
  } catch (error) {
    console.error("Upload error:", error);

    setMessages([
      {
        type: "system",
        content: `❌ Failed to upload ${file.name}: ${error.message}`
      }
    ]);
  }
};


const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { type: "user", content: input };
  setMessages(prev => [...prev, userMessage]);

  const question = input;
  setInput("");

  // Show typing indicator
  setMessages(prev => [
    ...prev,
    { type: "bot", content: "Thinking..." }
  ]);

  try {
    const response = await fetch("http://localhost:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: question,
        top_k: 5
      })
    });

    const data = await response.json();

    // Remove "Thinking..." and add real answer
    setMessages(prev => {
      const updated = [...prev];
      updated.pop(); // remove Thinking...
      return [
        ...updated,
        { type: "bot", content: data.answer || "No answer returned." }
      ];
    });

  } catch (error) {
    console.error("Query failed:", error);

    setMessages(prev => {
      const updated = [...prev];
      updated.pop(); // remove Thinking...
      return [
        ...updated,
        { type: "bot", content: "❌ Failed to reach server. Please try again." }
      ];
    });
  }
};


  const handleNewChat = () => {
    setMessages([]);
    setUploadedFile(null);
    setActiveChat(null);
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat.id);
    setMessages([{
      type: 'system',
      content: `Opened chat: ${chat.title}`
    }]);
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={20} />
          </button>
        </div>
        
        <div className="chat-list">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat)}
            >
              <File size={18} className="chat-icon" />
              <div className="chat-info">
                <div className="chat-title">{chat.title}</div>
                <div className="chat-date">{chat.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <div className="chat-header">
          <MessageSquare size={24} />
          <h1>PDF Chat Assistant</h1>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <Upload size={64} className="empty-icon" />
              <h3>Upload a PDF to get started</h3>
              <p>Ask questions and get insights from your documents</p>
              <button 
                className="upload-btn-large"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={20} />
                Choose PDF File
              </button>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-area">
          {uploadedFile && (
            <div className="uploaded-file-indicator">
              <File size={16} />
              <span>{uploadedFile.name}</span>
              <button onClick={() => setUploadedFile(null)}>
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="input-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
              style={{ display: 'none' }}
            />
            
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload PDF"
            >
              <Upload size={20} />
            </button>

            <input
              type="text"
              className="message-input"
              placeholder="Ask a question about your PDF..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />

            <button 
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}