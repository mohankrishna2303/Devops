// ChatGPT API Service for DevOps Website

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

class ChatGPTService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseURL = CHATGPT_API_URL;
  }

  // Validate website code and provide suggestions
  async validateCode(code, language = 'javascript') {
    try {
      const prompt = `As a senior DevOps engineer, analyze this ${language} code for:
1. Security vulnerabilities
2. Performance issues
3. Best practices violations
4. Potential bugs
5. Code quality improvements

Provide specific, actionable recommendations with code examples.

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Code validation failed:', error);
      throw error;
    }
  }

  // Analyze pipeline failures and suggest fixes
  async analyzePipelineFailure(pipelineData, errorLogs) {
    try {
      const prompt = `As a DevOps expert, analyze this pipeline failure and provide solutions:

Pipeline Data:
${JSON.stringify(pipelineData, null, 2)}

Error Logs:
${errorLogs}

Provide:
1. Root cause analysis
2. Immediate fixes
3. Long-term prevention strategies
4. Automation opportunities
5. Risk assessment`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Pipeline analysis failed:', error);
      throw error;
    }
  }

  // Generate infrastructure as code
  async generateInfrastructure(requirements) {
    try {
      const prompt = `Generate infrastructure as code for these requirements:
${JSON.stringify(requirements, null, 2)}

Provide:
1. Dockerfile
2. docker-compose.yml
3. Kubernetes manifests
4. CI/CD pipeline configuration
5. Environment variables setup

Make it production-ready with security best practices.`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Infrastructure generation failed:', error);
      throw error;
    }
  }

  // Security audit and recommendations
  async performSecurityAudit(projectData) {
    try {
      const prompt = `Perform a comprehensive security audit for this project:
${JSON.stringify(projectData, null, 2)}

Analyze:
1. Dependency vulnerabilities
2. Code security issues
3. Infrastructure security
4. Data protection
5. Access control
6. Compliance requirements

Provide risk levels and remediation steps.`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Security audit failed:', error);
      throw error;
    }
  }

  // Optimize performance
  async optimizePerformance(metrics) {
    try {
      const prompt = `Analyze these performance metrics and provide optimization strategies:
${JSON.stringify(metrics, null, 2)}

Focus on:
1. Build time optimization
2. Deployment speed
3. Resource utilization
4. Cost optimization
5. Scalability improvements`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Performance optimization failed:', error);
      throw error;
    }
  }

  // Generate documentation
  async generateDocumentation(projectInfo) {
    try {
      const prompt = `Generate comprehensive documentation for this project:
${JSON.stringify(projectInfo, null, 2)}

Create:
1. README.md with setup instructions
2. API documentation
3. Deployment guide
4. Troubleshooting guide
5. Architecture overview`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Documentation generation failed:', error);
      throw error;
    }
  }

  // Chat interface for general assistance
  async chat(message, context = {}) {
    try {
      const prompt = `As a DevOps assistant, help with this request:
${message}

Context: ${JSON.stringify(context, null, 2)}

Provide helpful, specific, and actionable advice for DevOps professionals.`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Chat failed:', error);
      throw error;
    }
  }

  // Make API request to ChatGPT
  async makeRequest(prompt) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert DevOps engineer with deep knowledge of cloud infrastructure, CI/CD, security, and automation. Provide practical, actionable advice with specific examples.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw error;
    }
  }

  // Set API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
  }

  // Get API key
  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key') || '';
    }
    return this.apiKey;
  }
}

export const chatGPTService = new ChatGPTService();
export default chatGPTService;
