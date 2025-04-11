
// Default code templates
const defaultHTML = `<!-- Write your HTML here -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web App</title>
</head>
<body>
  <div class="container">
    <h1>Task List</h1>
    <div class="input-group">
      <input type="text" id="taskInput" placeholder="Enter a new task...">
      <button id="addTaskBtn" class="add-btn">Add Task</button>
    </div>
    <div id="taskList" class="task-list">
      <!-- Tasks will be added here -->
    </div>
    <div class="controls">
      <button id="resetBtn" class="control-btn">Reset All Tasks</button>
      <button id="clearCompletedBtn" class="control-btn">Clear Completed</button>
      <button id="toggleDarkMode" class="control-btn">Toggle Dark Mode</button>
    </div>
  </div>
</body>
</html>`;

const defaultCSS = `/* Write your CSS here */
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --dark-color: #292f36;
  --light-color: #f7fff7;
  --danger-color: #ff6b6b;
  --success-color: #6bff8a;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  background: linear-gradient(135deg, #ff6b6b, #6b6bff);
  color: var(--dark-color);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.input-group {
  display: flex;
  margin-bottom: 1.5rem;
}

input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  outline: none;
  font-size: 1rem;
}

.add-btn {
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #ff5252;
}

.task-list {
  margin-bottom: 1.5rem;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.task-item.completed {
  opacity: 0.7;
  text-decoration: line-through;
}

.task-text {
  flex: 1;
}

.task-actions button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: transform 0.2s;
}

.task-actions button:hover {
  transform: scale(1.2);
}

.complete-btn {
  color: var(--success-color);
}

.delete-btn {
  color: var(--danger-color);
}

.controls {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.6rem 1rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.control-btn:hover {
  background-color: #3dbeab;
}

/* Dark Mode */
body.dark-mode {
  background: linear-gradient(135deg, #2c3e50, #4a69bd);
}

body.dark-mode .container {
  background-color: rgba(40, 44, 52, 0.9);
  color: #f8f9fa;
}

body.dark-mode h1 {
  color: #f8f9fa;
}

body.dark-mode input {
  background-color: #3a3f4b;
  color: #f8f9fa;
  border-color: #5a5f6b;
}

body.dark-mode .task-item {
  background-color: #3a3f4b;
  color: #f8f9fa;
}

body.dark-mode .control-btn {
  background-color: #5a5f6b;
}

body.dark-mode .control-btn:hover {
  background-color: #6c717f;
}`;

const defaultJS = `// Write your JavaScript here
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const resetBtn = document.getElementById('resetBtn');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
  
  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Load dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  
  // Render tasks
  function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      taskList.innerHTML = '<p style="text-align: center;">No tasks yet. Add one above!</p>';
      return;
    }
    
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task-item');
      if (task.completed) {
        taskItem.classList.add('completed');
      }
      
      taskItem.innerHTML = \`
        <span class="task-text">\${task.text}</span>
        <div class="task-actions">
          <button class="complete-btn" data-index="\${index}">✓</button>
          <button class="delete-btn" data-index="\${index}">✕</button>
        </div>
      \`;
      
      taskList.appendChild(taskItem);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
      btn.addEventListener('click', toggleComplete);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', deleteTask);
    });
    
    // Save to localStorage
    saveTasks();
  }
  
  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Add new task
  function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    
    tasks.push({
      text,
      completed: false
    });
    
    taskInput.value = '';
    renderTasks();
  }
  
  // Toggle task completion
  function toggleComplete(e) {
    const index = e.target.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  }
  
  // Delete task
  function deleteTask(e) {
    const index = e.target.dataset.index;
    tasks.splice(index, 1);
    renderTasks();
  }
  
  // Reset all tasks
  function resetTasks() {
    if (confirm('Are you sure you want to reset all tasks?')) {
      tasks = [];
      renderTasks();
    }
  }
  
  // Clear completed tasks
  function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
  }
  
  // Toggle dark mode
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }
  
  // Event listeners
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addTask();
  });
  resetBtn.addEventListener('click', resetTasks);
  clearCompletedBtn.addEventListener('click', clearCompleted);
  toggleDarkModeBtn.addEventListener('click', toggleDarkMode);
  
  // Initial render
  renderTasks();
});

// Console log for verification
console.log('Task List App is running!');
`;

// DOM Elements
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewIframe = document.getElementById('preview-iframe');
const resetBtn = document.getElementById('reset-btn');
const clearBtn = document.getElementById('clear-btn');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const resizeHandle = document.getElementById('resize-handle');
const editorsPanel = document.getElementById('editors-panel');
const previewPanel = document.getElementById('preview-panel');
const runBtn = document.querySelector('.run-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const htmlLineNumbers = document.getElementById('html-line-numbers');
const cssLineNumbers = document.getElementById('css-line-numbers');
const jsLineNumbers = document.getElementById('js-line-numbers');

// Initialize editors with stored or default code
function initEditors() {
  const savedData = localStorage.getItem('codegenie-data');
  
  if (savedData) {
    try {
      const { html, css, js } = JSON.parse(savedData);
      htmlEditor.value = html || defaultHTML;
      cssEditor.value = css || defaultCSS;
      jsEditor.value = js || defaultJS;
    } catch (e) {
      console.error('Failed to load saved code:', e);
      resetToDefaults();
    }
  } else {
    resetToDefaults();
  }
  
  // Initialize line numbers
  updateLineNumbers(htmlEditor, htmlLineNumbers);
  updateLineNumbers(cssEditor, cssLineNumbers);
  updateLineNumbers(jsEditor, jsLineNumbers);
  
  // Initial preview
  updatePreview();
}

// Update line numbers for a given editor
function updateLineNumbers(editor, lineNumbersElement) {
  const lines = editor.value.split('\n');
  let lineNumbersHTML = '';
  
  for (let i = 1; i <= lines.length; i++) {
    lineNumbersHTML += `<div>${i}</div>`;
  }
  
  lineNumbersElement.innerHTML = lineNumbersHTML;
  
  // Sync scroll positions
  editor.addEventListener('scroll', () => {
    lineNumbersElement.scrollTop = editor.scrollTop;
  });
}

// Reset to default code examples
function resetToDefaults() {
  htmlEditor.value = defaultHTML;
  cssEditor.value = defaultCSS;
  jsEditor.value = defaultJS;
  
  // Update line numbers
  updateLineNumbers(htmlEditor, htmlLineNumbers);
  updateLineNumbers(cssEditor, cssLineNumbers);
  updateLineNumbers(jsEditor, jsLineNumbers);
  
  // Update preview
  updatePreview();
}

// Clear all code
function clearAll() {
  if (confirm('Are you sure you want to clear all code?')) {
    htmlEditor.value = '<!-- Write your HTML here -->';
    cssEditor.value = '/* Write your CSS here */';
    jsEditor.value = '// Write your JavaScript here';
    
    // Update line numbers
    updateLineNumbers(htmlEditor, htmlLineNumbers);
    updateLineNumbers(cssEditor, cssLineNumbers);
    updateLineNumbers(jsEditor, jsLineNumbers);
    
    // Update preview
    updatePreview();
  }
}

// Generate and update preview
function updatePreview() {
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;
  
  const combinedOutput = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
      <style>${css}</style>
    </head>
    <body>${html}
      <script>${js}</script>
    </body>
    </html>
  `;
  
  // Update the iframe content
  const iframe = previewIframe;
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  
  iframeDocument.open();
  iframeDocument.write(combinedOutput);
  iframeDocument.close();
  
  // Save to localStorage
  saveToLocalStorage();
}

// Save code to localStorage
function saveToLocalStorage() {
  const codeData = {
    html: htmlEditor.value,
    css: cssEditor.value,
    js: jsEditor.value
  };
  
  localStorage.setItem('codegenie-data', JSON.stringify(codeData));
}

// Handle resize functionality
let isResizing = false;
let startX = 0;
let startWidth = 0;
let startY = 0;
let startHeight = 0;

function initResize() {
  resizeHandle.addEventListener('mousedown', startResize);
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
  
  // Touch events for mobile
  resizeHandle.addEventListener('touchstart', startResizeTouch);
  document.addEventListener('touchmove', resizeTouch);
  document.addEventListener('touchend', stopResize);
}

function startResize(e) {
  isResizing = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = editorsPanel.offsetWidth;
  startHeight = editorsPanel.offsetHeight;
  resizeHandle.classList.add('active');
  document.body.style.cursor = window.innerWidth <= 768 ? 'row-resize' : 'col-resize';
  document.body.style.userSelect = 'none';
}

function startResizeTouch(e) {
  if (e.touches.length === 1) {
    isResizing = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startWidth = editorsPanel.offsetWidth;
    startHeight = editorsPanel.offsetHeight;
    resizeHandle.classList.add('active');
  }
}

function resize(e) {
  if (!isResizing) return;
  
  if (window.innerWidth <= 768) {
    // Vertical resize for mobile
    const containerHeight = document.querySelector('.editor-container').offsetHeight;
    const newHeight = startHeight + (e.clientY - startY);
    const heightPercentage = (newHeight / containerHeight) * 100;
    
    // Limit min/max height
    if (heightPercentage >= 20 && heightPercentage <= 80) {
      editorsPanel.style.height = `${heightPercentage}%`;
      previewPanel.style.height = `${100 - heightPercentage}%`;
    }
  } else {
    // Horizontal resize for desktop
    const containerWidth = document.querySelector('.editor-container').offsetWidth;
    const newWidth = startWidth + (e.clientX - startX);
    const widthPercentage = (newWidth / containerWidth) * 100;
    
    // Limit min/max width
    if (widthPercentage >= 20 && widthPercentage <= 80) {
      editorsPanel.style.width = `${widthPercentage}%`;
      previewPanel.style.flex = '1';
    }
  }
}

function resizeTouch(e) {
  if (!isResizing || e.touches.length !== 1) return;
  
  if (window.innerWidth <= 768) {
    // Vertical resize for mobile
    const containerHeight = document.querySelector('.editor-container').offsetHeight;
    const newHeight = startHeight + (e.touches[0].clientY - startY);
    const heightPercentage = (newHeight / containerHeight) * 100;
    
    // Limit min/max height
    if (heightPercentage >= 20 && heightPercentage <= 80) {
      editorsPanel.style.height = `${heightPercentage}%`;
      previewPanel.style.height = `${100 - heightPercentage}%`;
    }
  } else {
    // Horizontal resize for desktop
    const containerWidth = document.querySelector('.editor-container').offsetWidth;
    const newWidth = startWidth + (e.touches[0].clientX - startX);
    const widthPercentage = (newWidth / containerWidth) * 100;
    
    // Limit min/max width
    if (widthPercentage >= 20 && widthPercentage <= 80) {
      editorsPanel.style.width = `${widthPercentage}%`;
      previewPanel.style.flex = '1';
    }
  }
}

function stopResize() {
  isResizing = false;
  resizeHandle.classList.remove('active');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
}

// Editor event listeners
function initEditorListeners() {
  // Text changes in editors
  htmlEditor.addEventListener('input', function() {
    updateLineNumbers(this, htmlLineNumbers);
    updatePreviewDebounced();
  });
  
  cssEditor.addEventListener('input', function() {
    updateLineNumbers(this, cssLineNumbers);
    updatePreviewDebounced();
  });
  
  jsEditor.addEventListener('input', function() {
    updateLineNumbers(this, jsLineNumbers);
    updatePreviewDebounced();
  });
  
  // Handle tab key in editors
  [htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        // Insert 2 spaces for indentation
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const spaces = '  ';
        
        this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + spaces.length;
        
        // Update line numbers and preview
        if (this === htmlEditor) updateLineNumbers(this, htmlLineNumbers);
        if (this === cssEditor) updateLineNumbers(this, cssLineNumbers);
        if (this === jsEditor) updateLineNumbers(this, jsLineNumbers);
        
        updatePreviewDebounced();
      }
    });
  });
  
  // View Controls
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      viewBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const view = this.textContent.toLowerCase();
      const editorContainer = document.querySelector('.editor-container');
      
      if (view === 'split') {
        editorContainer.classList.remove('editor-only', 'preview-only');
        editorsPanel.style.display = 'flex';
        previewPanel.style.display = 'flex';
        
        // Reset to default split
        if (window.innerWidth <= 768) {
          editorsPanel.style.width = '100%';
          editorsPanel.style.height = '60%';
          previewPanel.style.height = '40%';
        } else {
          editorsPanel.style.width = '50%';
          previewPanel.style.flex = '1';
        }
      } else if (view === 'editor') {
        editorContainer.classList.add('editor-only');
        editorContainer.classList.remove('preview-only');
        editorsPanel.style.display = 'flex';
        previewPanel.style.display = 'none';
        editorsPanel.style.width = '100%';
      } else if (view === 'preview') {
        editorContainer.classList.add('preview-only');
        editorContainer.classList.remove('editor-only');
        editorsPanel.style.display = 'none';
        previewPanel.style.display = 'flex';
        previewPanel.style.flex = '1';
      }
    });
  });
  
  // File items
  const fileItems = document.querySelectorAll('.file-item');
  fileItems.forEach(item => {
    item.addEventListener('click', function() {
      fileItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Buttons
  resetBtn?.addEventListener('click', resetToDefaults);
  clearBtn?.addEventListener('click', clearAll);
  refreshPreviewBtn?.addEventListener('click', updatePreview);
  runBtn?.addEventListener('click', updatePreview);
}

// Debounce function to prevent too many preview updates
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

const updatePreviewDebounced = debounce(updatePreview, 500);

// Initialize the application
function init() {
  initEditors();
  initResize();
  initEditorListeners();
  
  // Window resize handler for responsive layout
  window.addEventListener('resize', function() {
    // Reset editor panel size for mobile layouts
    if (window.innerWidth <= 768) {
      if (!document.querySelector('.editor-container').classList.contains('editor-only') &&
          !document.querySelector('.editor-container').classList.contains('preview-only')) {
        editorsPanel.style.width = '100%';
        editorsPanel.style.height = '60%';
        previewPanel.style.height = '40%';
      }
    } else {
      // Default split for desktop if not set
      if (!document.querySelector('.editor-container').classList.contains('editor-only') &&
          !document.querySelector('.editor-container').classList.contains('preview-only') &&
          !editorsPanel.style.width) {
        editorsPanel.style.width = '50%';
        previewPanel.style.flex = '1';
      }
    }
  });
  
  // Check initial window size
  if (window.innerWidth <= 768) {
    editorsPanel.style.width = '100%';
    editorsPanel.style.height = '60%';
    previewPanel.style.height = '40%';
  }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
