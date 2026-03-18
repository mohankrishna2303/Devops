// Placeholder service - ChatGPT service has been removed
// All AI chat functionality has been disabled

const chatgptService = {
  chat: async (message) => {
    console.log('ChatGPT service has been removed');
    throw new Error('ChatGPT functionality is no longer available');
  },
  
  getPatch: async (failureId) => {
    console.log('AI patch service has been removed');
    throw new Error('AI patch functionality is no longer available');
  }
};

export default chatgptService;
