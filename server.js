const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000; // You can change this port if needed

// MongoDB connection string
const uri = "PAST THE LINK";

// Mongoose schema for chat history (optional)
const chatHistorySchema = new mongoose.Schema({
  userMessage: String,
  aiResponse: String
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ... rest of your server code

app.use(cors()); // To allow cross-origin requests from your client
app.use(bodyParser.json()); // For parsing JSON request bodies

// Replace with your actual OpenAI API key (ensure proper access for this endpoint)
const apiKey = 'ADD YOUR API KEY';

const apiUrl = 'https://api.openai.com/v1/chat/completions';

// Define the '/api/chat' API endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(apiUrl, {
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "Welcome to Curious Advisor! How can I assist you today?" },
        { "role": "user", "content": message }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const aiResponse = response.data.choices[0].message.content;
      console.log("AI Response:", aiResponse); // Log AI response for debugging

      // Save chat history to MongoDB
      const chatData = new ChatHistory({
        userMessage: message,
        aiResponse: aiResponse
      });
      await chatData.save();

      res.json({ response: aiResponse });
    } else {
      res.status(404).json({ error: 'No response from OpenAI API' }); // Handle no response with 404
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while sending the chat message.' });
  }
});

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (path.endsWith('.js')) res.setHeader('Content-Type', 'text/javascript');
    if (path.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
  }
}));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// API endpoint to fetch chat history
app.get('/api/chat-history', async (req, res) => {
    try {
      const chatHistory = await ChatHistory.find();
      res.json(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  });
  
  // API endpoint to clear chat history
  app.delete('/api/chat-history', async (req, res) => {
    try {
      await ChatHistory.deleteMany();
      res.json({ message: 'Chat history cleared' });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      res.status(500).json({ error: 'Failed to clear chat history' });
    }
  });
  