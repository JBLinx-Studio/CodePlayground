
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
    <h1>Hello, World!</h1>
    <p>Welcome to CodeGenie Studio</p>
  </div>
</body>
</html>`;

const defaultCSS = `/* Write your CSS here */
.container {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #7c4dff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  color: #333;
  font-size: 1.2rem;
  line-height: 1.5;
}`;

const defaultJS = `// Write your JavaScript here
console.log("CodeGenie Studio is running!");

// Add an event listener to change the title color when clicked
document.addEventListener('DOMContentLoaded', function() {
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', function() {
      this.style.color = getRandomColor();
    });
  }
});

// Generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}`;

// DOM Elements
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewIframe = document.getElementById('preview-iframe');
const resetBtn = document.getElementById('reset-btn');
const clearBtn = document.getElementById('clear-btn');
const refreshPreviewBtn = document.getElementById('refresh-preview');
const runBtn = document.getElementById('run-btn');
const resizeHandle = document.getElementById('resize-handle');
const editorsPanel = document.getElementById('editors-panel');
const previewPanel = document.getElementById('preview-panel');
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
  resetBtn.addEventListener('click', resetToDefaults);
  clearBtn.addEventListener('click', clearAll);
  refreshPreviewBtn.addEventListener('click', updatePreview);
  runBtn.addEventListener('click', updatePreview);
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
