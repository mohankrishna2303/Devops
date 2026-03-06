import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Settings, CheckCircle, AlertTriangle, Lightbulb, Shield, Zap, FileText, Code } from 'lucide-react';
import { chatGPTService } from '../services/chatgptService';
import './ChatGPTAssistant.css';

const ChatGPTAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [activeFeature, setActiveFeature] = useState('chat');

  useEffect(() => {
    const savedApiKey = chatGPTService.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // Add welcome message
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your DevOps AI assistant. I can help you with:\n\n🔍 Code validation and security analysis\n🚀 Pipeline optimization and failure analysis\n🏗️ Infrastructure as code generation\n📊 Performance optimization\n📚 Documentation generation\n\nHow can I assist you today?',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      
      // Route to specific features based on input
      if (input.toLowerCase().includes('validate') || input.toLowerCase().includes('code')) {
        response = await chatGPTService.validateCode(input);
      } else if (input.toLowerCase().includes('pipeline') || input.toLowerCase().includes('failure')) {
        response = await chatGPTService.analyzePipelineFailure({}, input);
      } else if (input.toLowerCase().includes('infrastructure') || input.toLowerCase().includes('docker')) {
        response = await chatGPTService.generateInfrastructure({ requirements: input });
      } else if (input.toLowerCase().includes('security') || input.toLowerCase().includes('audit')) {
        response = await chatGPTService.performSecurityAudit({ project: input });
      } else if (input.toLowerCase().includes('performance') || input.toLowerCase().includes('optimize')) {
        response = await chatGPTService.optimizePerformance({
          metrics: input
        });
      } else if (input.toLowerCase().includes('document') || input.toLowerCase().includes('readme')) {
        response = await chatGPTService.generateDocumentation({ project: input });
      } else {
        response = await chatGPTService.chat(input);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}\n\nPlease make sure your OpenAI API key is configured correctly in settings.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = () => {
    if (apiKey.trim()) {
      chatGPTService.setApiKey(apiKey);
      setShowSettings(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✅ API key configured successfully! You can now use all AI features.',
        timestamp: new Date()
      }]);
    }
  };

  const handleFeatureClick = async (feature) => {
    setActiveFeature(feature);
    setIsLoading(true);

    try {
      let response;
      switch (feature) {
        case 'validate':
          response = await chatGPTService.validateCode('// Example React component\nfunction App() {\n  return <div>Hello World</div>;\n}');
          break;
        case 'pipeline':
          response = await chatGPTService.analyzePipelineFailure(
            { pipeline: 'build-deploy', status: 'failed' },
            'Build failed with npm install error'
          );
          break;
        case 'infrastructure':
          response = await chatGPTService.generateInfrastructure({
            app: 'React Node.js app',
            database: 'PostgreSQL',
            deployment: 'Kubernetes'
          });
          break;
        case 'security':
          response = await chatGPTService.performSecurityAudit({
            framework: 'React',
            backend: 'Node.js',
            database: 'PostgreSQL'
          });
          break;
        case 'performance':
          response = await chatGPTService.optimizePerformance({
            buildTime: '5min',
            deployTime: '3min',
            memoryUsage: '512MB'
          });
          break;
        case 'docs':
          response = await chatGPTService.generateDocumentation({
            name: 'DevOps Dashboard',
            tech: 'React, Node.js, PostgreSQL'
          });
          break;
        default:
          response = 'Feature not implemented yet.';
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { id: 'validate', icon: <Code size={16} />, label: 'Validate Code', color: '#3B82F6' },
    { id: 'pipeline', icon: <Zap size={16} />, label: 'Analyze Pipeline', color: '#10B981' },
    { id: 'infrastructure', icon: <Shield size={16} />, label: 'Generate Infrastructure', color: '#8B5CF6' },
    { id: 'security', icon: <AlertTriangle size={16} />, label: 'Security Audit', color: '#EF4444' },
    { id: 'performance', icon: <Lightbulb size={16} />, label: 'Optimize Performance', color: '#F59E0B' },
    { id: 'docs', icon: <FileText size={16} />, label: 'Generate Docs', color: '#6366F1' }
  ];

  return (
    <div className="chatgpt-assistant">
      <div className="chat-header">
        <div className="header-left">
          <Bot size={24} className="bot-icon" />
          <div>
            <h3>DevOps AI Assistant</h3>
            <span className="status">Powered by ChatGPT</span>
          </div>
        </div>
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h4>OpenAI API Configuration</h4>
          <div className="api-key-input">
            <input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button onClick={handleApiKeySave}>
              <CheckCircle size={16} />
              Save
            </button>
          </div>
          <p className="help-text">
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>
          </p>
        </div>
      )}

      <div className="quick-actions">
        {quickActions.map(action => (
          <button
            key={action.id}
            className={`action-btn ${activeFeature === action.id ? 'active' : ''}`}
            onClick={() => handleFeatureClick(action.id)}
            disabled={isLoading}
            style={{ borderColor: action.color }}
          >
            <span style={{ color: action.color }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">
              <Bot size={16} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Ask me anything about DevOps, pipelines, security, or optimization..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="send-btn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTAssistant;
