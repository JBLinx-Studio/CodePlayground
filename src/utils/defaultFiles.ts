
export const defaultFiles = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Playground</title>
</head>
<body>
  <div id="app">
    <h1>Welcome to CodePlayground</h1>
    <p>Edit the files to start building your web application!</p>
    <button id="clickMe">Click Me!</button>
  </div>
</body>
</html>`,

  'styles.css': `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
}

h1 {
  color: #3730a3;
  text-align: center;
  margin-top: 40px;
  font-size: 2.5rem;
}

p {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 30px;
}

button {
  display: block;
  margin: 0 auto;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}`,

  'script.js': `// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the button element
  const button = document.getElementById('clickMe');
  
  // Add click event listener
  button.addEventListener('click', () => {
    // Change text and add animation
    button.textContent = 'Clicked!';
    button.style.backgroundColor = '#10b981';
    
    // Create a new element to display a message
    const message = document.createElement('p');
    message.textContent = 'Great job! You ran your first script.';
    message.style.color = '#10b981';
    message.style.fontWeight = 'bold';
    
    // Add it to the page
    document.getElementById('app').appendChild(message);
    
    // Reset after 2 seconds
    setTimeout(() => {
      button.textContent = 'Click Me!';
      button.style.backgroundColor = '#4f46e5';
    }, 2000);
  });
  
  // Log a message to the console
  console.log('Script loaded and ready!');
});`
};
