
# A Dynamic Chatbot Web Application

## Project Overview
This project is a simple web application that integrates a chatbot using OpenAI's GPT-3.5 language model. The application consists of a frontend chat interface where users can interact with the chatbot, and a backend server that handles user messages and communicates with the AI API.

## Requirements
The application consists of the following components:

### 1. Frontend
- **Chat Interface**: A user-friendly chat interface designed using HTML, CSS, and JavaScript.
- **Text Input**: A text input field for users to type their messages.
- **Chat History**: A display area for chat history, showing both user messages and bot responses.

### 2. Backend
- **Server Setup**: A basic server created using Node.js and Express.js to handle API requests.
- **API Endpoint**: An endpoint to manage user messages and interact with the language model API.

### 3. AI Integration
- **OpenAI API**: Integration with OpenAI's GPT-3.5 to process user messages and generate responses.

### 4. Database
- **MongoDB**: A simple MongoDB database to store chat history for later retrieval.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB account and access to a MongoDB instance (local or cloud).
- OpenAI API key (if using the OpenAI API).

### Installation

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd chatbot-web-app
   ```

2. **Install Backend Dependencies**:
   Navigate to the backend directory and install the necessary packages:
   ```
   cd backend
   npm install express axios body-parser cors mongoose
   ```

3. **Set Up MongoDB**:
   - Create a new database in MongoDB for chat history.
   - Update the connection string in `server.js` to include your MongoDB credentials.

4. **Configure OpenAI API**:
   - Add your OpenAI API key to the `server.js` file in the appropriate location.

### Running the Application

1. **Start the Backend Server**:
   ```
   node server.js
   ```
   The server should start on `http://localhost:3000`.

2. **Open the Frontend**:
   Open the `index.html` file in your web browser. You can also serve the frontend using a local server (e.g., Live Server in VSCode) if you prefer.

### Usage
- Type your message in the input field and click "Send" to interact with the chatbot.
- Chat history will be saved in the MongoDB database and can be viewed later.

### Project Structure
```
chatbot-web-app/
│
├── backend/
│   ├── server.js              # Node.js server
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (if used)
│
├── public/
│   ├── index.html             # Frontend HTML
│   ├── chatbot.css            # CSS styles for the chat interface
│   └── chatbot.js             # JavaScript for handling chat logic
│
└── README.md                  # Project documentation
```

### Future Improvements
- Add user authentication to save individual chat histories.
- Implement a more sophisticated UI with frameworks like React or Vue.js.
- Enhance error handling for user inputs and API responses.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to adjust any sections as per your project specifics or additional features you might implement!
