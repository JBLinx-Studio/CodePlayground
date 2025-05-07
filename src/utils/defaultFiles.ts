
import { FilesState } from '@/types/file';

export const defaultFiles: FilesState = {
  'index.html': {
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <h1>Welcome to CodePlayground</h1>
    <p>Start editing to see your changes come to life!</p>
    <button id="demo-button">Click Me!</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    type: 'html'
  },
  'styles.css': {
    content: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
}

h1 {
  color: #4361ee;
  text-align: center;
  margin-bottom: 20px;
}

p {
  margin-bottom: 20px;
  font-size: 18px;
}

#demo-button {
  background-color: #4361ee;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

#demo-button:hover {
  background-color: #3046c5;
}`,
    type: 'css'
  },
  'script.js': {
    content: `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get a reference to the button
  const button = document.getElementById('demo-button');
  
  // Add a click event listener
  button.addEventListener('click', function() {
    alert('Hello from CodePlayground!');
    
    // Change button text after click
    this.textContent = 'Clicked!';
    
    // Change button color
    this.style.backgroundColor = '#10b981';
  });
  
  // Log a message to the console
  console.log('Script loaded and ready!');
});`,
    type: 'js'
  }
};
