
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create default files if they don't exist in localStorage
const initializeDefaultFiles = () => {
  // Check if we already have files in localStorage
  if (!localStorage.getItem('codePlayground_files')) {
    // Create default files
    const defaultFiles = {
      'index.html': {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePlayground</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to CodePlayground</h1>
    <p>Start coding your amazing web projects here!</p>
    <button id="demo-btn">Click Me!</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'styles.css': {
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to right bottom, #f3f4f6, #e5e7eb);
  color: #1f2937;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1rem;
  color: #4f46e5;
}

p {
  margin-bottom: 2rem;
  color: #4b5563;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}`
      },
      'script.js': {
        content: `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the button element
  const button = document.getElementById('demo-btn');
  
  // Add a click event listener to the button
  button.addEventListener('click', () => {
    // Change the text and style of the button when clicked
    button.textContent = 'Thanks for clicking!';
    button.style.backgroundColor = '#10b981';
    
    // Create a new element to show after clicking
    const message = document.createElement('p');
    message.textContent = 'You just ran JavaScript code!';
    message.style.color = '#10b981';
    message.style.fontWeight = 'bold';
    message.style.marginTop = '1rem';
    
    // Add the new element to the page
    document.querySelector('.container').appendChild(message);
    
    // Log a message to the console
    console.log('Button was clicked at: ' + new Date().toLocaleTimeString());
  });
  
  console.log('CodePlayground initialized successfully!');
});`
      }
    };
    
    // Save to localStorage
    localStorage.setItem('codePlayground_files', JSON.stringify(defaultFiles));
    localStorage.setItem('codePlayground_currentFile', 'index.html');
  }
};

// Initialize default files
initializeDefaultFiles();

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element not found")

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
