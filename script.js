
// File System Management
const fileSystem = {
  files: {
    'index.html': { content: '', type: 'html' },
    'styles.css': { content: '', type: 'css' },
    'script.js': { content: '', type: 'js' }
  },
  currentFile: 'styles.css',
  addFile: function(fileName, fileType) {
    if (this.files[fileName]) {
      return false; // File already exists
    }
    
    this.files[fileName] = {
      content: getDefaultContent(fileType),
      type: fileType
    };
    
    return true;
  },
  getFile: function(fileName) {
    return this.files[fileName] || null;
  },
  updateFile: function(fileName, content) {
    if (this.files[fileName]) {
      this.files[fileName].content = content;
      return true;
    }
    return false;
  },
  deleteFile: function(fileName) {
    if (fileName === 'index.html' || fileName === 'styles.css' || fileName === 'script.js') {
      return false; // Can't delete default files
    }
    
    if (this.files[fileName]) {
      delete this.files[fileName];
      return true;
    }
    return false;
  },
  getAllFiles: function() {
    return Object.keys(this.files).map(fileName => ({
      name: fileName,
      type: this.files[fileName].type
    }));
  },
  saveToLocalStorage: function() {
    localStorage.setItem('codeplayground-files', JSON.stringify(this.files));
    localStorage.setItem('codeplayground-current-file', this.currentFile);
  },
  loadFromLocalStorage: function() {
    const savedFiles = localStorage.getItem('codeplayground-files');
    const currentFile = localStorage.getItem('codeplayground-current-file');
    
    if (savedFiles) {
      try {
        this.files = JSON.parse(savedFiles);
      } catch (e) {
        console.error('Failed to load saved files:', e);
      }
    }
    
    if (currentFile && this.files[currentFile]) {
      this.currentFile = currentFile;
    }
  }
};

// Default code templates
const defaultHTML = `<!-- Write your HTML here -->
<div class="container">
  <h1>Hello, World!</h1>
  <p>Welcome to CodePlayground</p>
</div>`;

const defaultCSS = `/* Write your CSS here */
.container {
  text-align: center;
  font-family: sans-serif;
  padding: 2rem;
}

h1 {
  color: #7c4dff;
}`;

const defaultJS = `// Write your JavaScript here
console.log("CodePlayground is running!");

document.addEventListener('DOMContentLoaded', function() {
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', function() {
      this.style.color = getRandomColor();
    });
  }
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}`;

function getDefaultContent(fileType) {
  switch (fileType) {
    case 'html':
      return '<!-- Write your HTML here -->\n<div>\n  \n</div>';
    case 'css':
      return '/* Write your CSS here */\n';
    case 'js':
      return '// Write your JavaScript here\n';
    default:
      return '';
  }
}

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
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');
const settingsSave = document.getElementById('settings-save');
const settingsReset = document.getElementById('settings-reset');
const addFileBtn = document.getElementById('add-file-btn');
const addFileModal = document.getElementById('add-file-modal');
const addFileClose = document.getElementById('add-file-close');
const addFileSave = document.getElementById('add-file-save');
const addFileCancel = document.getElementById('add-file-cancel');
const fileList = document.getElementById('file-list');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const aiBtn = document.getElementById('ai-btn');
const aiSidebar = document.getElementById('ai-sidebar');
const aiCloseBtn = document.getElementById('ai-close-btn');
const aiSendBtn = document.getElementById('ai-send-btn');
const aiPrompt = document.getElementById('ai-prompt');
const notification = document.getElementById('notification');

// Settings
const settings = {
  fontSize: '14px',
  tabSize: 2,
  autoUpdate: true,
  theme: 'dark',
  showSidebar: true,
  showLineNumbers: true,
  saveToLocalStorage: function() {
    localStorage.setItem('codeplayground-settings', JSON.stringify({
      fontSize: this.fontSize,
      tabSize: this.tabSize,
      autoUpdate: this.autoUpdate,
      theme: this.theme,
      showSidebar: this.showSidebar,
      showLineNumbers: this.showLineNumbers
    }));
  },
  loadFromLocalStorage: function() {
    const savedSettings = localStorage.getItem('codeplayground-settings');
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.fontSize = parsed.fontSize || '14px';
        this.tabSize = parsed.tabSize || 2;
        this.autoUpdate = parsed.autoUpdate !== undefined ? parsed.autoUpdate : true;
        this.theme = parsed.theme || 'dark';
        this.showSidebar = parsed.showSidebar !== undefined ? parsed.showSidebar : true;
        this.showLineNumbers = parsed.showLineNumbers !== undefined ? parsed.showLineNumbers : true;
      } catch (e) {
        console.error('Failed to load saved settings:', e);
      }
    }
    
    this.applySettings();
  },
  applySettings: function() {
    // Apply font size
    htmlEditor.style.fontSize = this.fontSize;
    cssEditor.style.fontSize = this.fontSize;
    jsEditor.style.fontSize = this.fontSize;
    htmlLineNumbers.style.fontSize = this.fontSize;
    cssLineNumbers.style.fontSize = this.fontSize;
    jsLineNumbers.style.fontSize = this.fontSize;
    
    // Apply tab size
    htmlEditor.style.tabSize = this.tabSize;
    cssEditor.style.tabSize = this.tabSize;
    jsEditor.style.tabSize = this.tabSize;
    
    // Apply theme
    if (this.theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    
    // Apply sidebar visibility
    const sidebar = document.querySelector('.sidebar');
    if (this.showSidebar) {
      sidebar.classList.add('show');
    } else {
      sidebar.classList.remove('show');
    }
    
    // Apply line numbers visibility
    if (this.showLineNumbers) {
      htmlLineNumbers.style.display = 'block';
      cssLineNumbers.style.display = 'block';
      jsLineNumbers.style.display = 'block';
      htmlEditor.style.paddingLeft = '3.5rem';
      cssEditor.style.paddingLeft = '3.5rem';
      jsEditor.style.paddingLeft = '3.5rem';
    } else {
      htmlLineNumbers.style.display = 'none';
      cssLineNumbers.style.display = 'none';
      jsLineNumbers.style.display = 'none';
      htmlEditor.style.paddingLeft = '1rem';
      cssEditor.style.paddingLeft = '1rem';
      jsEditor.style.paddingLeft = '1rem';
    }
    
    // Update form fields
    document.getElementById('font-size').value = this.fontSize;
    document.getElementById('tab-size').value = this.tabSize.toString();
    document.getElementById('auto-update').checked = this.autoUpdate;
    document.getElementById('theme-select').value = this.theme;
    document.getElementById('show-sidebar').checked = this.showSidebar;
    document.getElementById('show-line-numbers').checked = this.showLineNumbers;
  }
};

// Initialize editors with stored or default code
function initEditors() {
  // Load settings
  settings.loadFromLocalStorage();
  
  // Load file system
  fileSystem.loadFromLocalStorage();
  
  // If no files were loaded from localStorage, set defaults
  if (!fileSystem.files['index.html'].content) {
    fileSystem.files['index.html'].content = defaultHTML;
    fileSystem.files['styles.css'].content = defaultCSS;
    fileSystem.files['script.js'].content = defaultJS;
  }
  
  // Set editor contents
  htmlEditor.value = fileSystem.files['index.html'].content;
  cssEditor.value = fileSystem.files['styles.css'].content;
  jsEditor.value = fileSystem.files['script.js'].content;
  
  // Update line numbers
  updateLineNumbers(htmlEditor, htmlLineNumbers);
  updateLineNumbers(cssEditor, cssLineNumbers);
  updateLineNumbers(jsEditor, jsLineNumbers);
  
  // Update file list
  updateFileList();
  
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
  if (confirm('Are you sure you want to reset all code to defaults?')) {
    htmlEditor.value = defaultHTML;
    cssEditor.value = defaultCSS;
    jsEditor.value = defaultJS;
    
    fileSystem.updateFile('index.html', defaultHTML);
    fileSystem.updateFile('styles.css', defaultCSS);
    fileSystem.updateFile('script.js', defaultJS);
    
    // Update line numbers
    updateLineNumbers(htmlEditor, htmlLineNumbers);
    updateLineNumbers(cssEditor, cssLineNumbers);
    updateLineNumbers(jsEditor, jsLineNumbers);
    
    // Update preview
    updatePreview();
    
    // Save to localStorage
    fileSystem.saveToLocalStorage();
    
    showNotification('Reset to defaults successfully');
  }
}

// Clear all code
function clearAll() {
  if (confirm('Are you sure you want to clear all code?')) {
    htmlEditor.value = '<!-- Write your HTML here -->';
    cssEditor.value = '/* Write your CSS here */';
    jsEditor.value = '// Write your JavaScript here';
    
    fileSystem.updateFile('index.html', htmlEditor.value);
    fileSystem.updateFile('styles.css', cssEditor.value);
    fileSystem.updateFile('script.js', jsEditor.value);
    
    // Update line numbers
    updateLineNumbers(htmlEditor, htmlLineNumbers);
    updateLineNumbers(cssEditor, cssLineNumbers);
    updateLineNumbers(jsEditor, jsLineNumbers);
    
    // Update preview
    updatePreview();
    
    // Save to localStorage
    fileSystem.saveToLocalStorage();
    
    showNotification('All code cleared');
  }
}

// Generate and update preview
function updatePreview() {
  const html = fileSystem.files['index.html'].content;
  const css = fileSystem.files['styles.css'].content;
  const js = fileSystem.files['script.js'].content;
  
  // Collect content from all CSS files
  let allCSS = css;
  Object.keys(fileSystem.files).forEach(fileName => {
    if (fileName !== 'styles.css' && fileSystem.files[fileName].type === 'css') {
      allCSS += '\n' + fileSystem.files[fileName].content;
    }
  });
  
  // Collect content from all JS files
  let allJS = js;
  Object.keys(fileSystem.files).forEach(fileName => {
    if (fileName !== 'script.js' && fileSystem.files[fileName].type === 'js') {
      allJS += '\n' + fileSystem.files[fileName].content;
    }
  });
  
  const combinedOutput = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
      <style>${allCSS}</style>
    </head>
    <body>${html}
      <script>${allJS}</script>
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
  fileSystem.saveToLocalStorage();
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

// Copy code to clipboard
function copyCode() {
  const html = fileSystem.files['index.html'].content;
  const css = fileSystem.files['styles.css'].content;
  const js = fileSystem.files['script.js'].content;
  
  const allCode = `
/* HTML */
${html}

/* CSS */
${css}

/* JavaScript */
${js}
  `;
  
  navigator.clipboard.writeText(allCode)
    .then(() => {
      showNotification('Code copied to clipboard');
    })
    .catch(err => {
      console.error('Error copying text: ', err);
      showNotification('Failed to copy code');
    });
}

// Download code as a zip file
function downloadCode() {
  // Create a text file with all the code
  const html = fileSystem.files['index.html'].content;
  const css = fileSystem.files['styles.css'].content;
  const js = fileSystem.files['script.js'].content;
  
  // Create HTML file content
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePlayground Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
  <script src="script.js"></script>
</body>
</html>`;
  
  // Create download links
  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  const cssBlob = new Blob([css], { type: 'text/css' });
  const jsBlob = new Blob([js], { type: 'text/javascript' });
  
  // Create download links
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const cssUrl = URL.createObjectURL(cssBlob);
  const jsUrl = URL.createObjectURL(jsBlob);
  
  // Create a temporary link and trigger the download
  function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Download each file
  downloadFile(htmlUrl, 'index.html');
  downloadFile(cssUrl, 'styles.css');
  downloadFile(jsUrl, 'script.js');
  
  showNotification('Files downloaded');
}

// Toggle AI sidebar
function toggleAiSidebar() {
  aiSidebar.classList.toggle('show');
}

// Create a new file
function createNewFile() {
  const fileName = document.getElementById('file-name').value.trim();
  const fileType = document.getElementById('file-type').value;
  
  if (!fileName) {
    showNotification('Please enter a file name');
    return;
  }
  
  // Add file extension if not provided
  let finalFileName = fileName;
  if (!finalFileName.includes('.')) {
    if (fileType === 'html') {
      finalFileName += '.html';
    } else if (fileType === 'css') {
      finalFileName += '.css';
    } else if (fileType === 'js') {
      finalFileName += '.js';
    }
  }
  
  if (fileSystem.addFile(finalFileName, fileType)) {
    updateFileList();
    closeAddFileModal();
    showNotification(`File "${finalFileName}" created`);
    selectFile(finalFileName);
  } else {
    showNotification(`File "${finalFileName}" already exists`);
  }
}

// Update file list in sidebar
function updateFileList() {
  // Clear file list
  fileList.innerHTML = '';
  
  // Add all files
  const files = fileSystem.getAllFiles();
  files.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    if (file.name === fileSystem.currentFile) {
      fileItem.classList.add('active');
    }
    fileItem.dataset.file = file.name;
    
    // Get icon based on file type
    let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    
    fileItem.innerHTML = `
      ${iconSvg}
      <span>${file.name}</span>
    `;
    
    fileItem.addEventListener('click', () => selectFile(file.name));
    fileList.appendChild(fileItem);
  });
}

// Select a file to edit
function selectFile(fileName) {
  const file = fileSystem.getFile(fileName);
  if (!file) return;
  
  fileSystem.currentFile = fileName;
  
  // Update active file in UI
  const fileItems = document.querySelectorAll('.file-item');
  fileItems.forEach(item => {
    if (item.dataset.file === fileName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // If it's one of the main files, update the editor
  if (fileName === 'index.html') {
    htmlEditor.value = file.content;
    updateLineNumbers(htmlEditor, htmlLineNumbers);
  } else if (fileName === 'styles.css') {
    cssEditor.value = file.content;
    updateLineNumbers(cssEditor, cssLineNumbers);
  } else if (fileName === 'script.js') {
    jsEditor.value = file.content;
    updateLineNumbers(jsEditor, jsLineNumbers);
  }
  
  // Save current state
  fileSystem.saveToLocalStorage();
}

// Show notification
function showNotification(message) {
  const notificationMessage = document.querySelector('.notification-message');
  notificationMessage.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// View control (Split, Editor, Preview)
function handleViewChange() {
  const view = this.dataset.view;
  
  // Remove active class from all view buttons
  viewBtns.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  this.classList.add('active');
  
  // Apply the selected view
  const editorContainer = document.querySelector('.editor-container');
  
  if (view === 'split') {
    editorContainer.classList.remove('editor-only', 'preview-only');
  } else if (view === 'editor') {
    editorContainer.classList.add('editor-only');
    editorContainer.classList.remove('preview-only');
  } else if (view === 'preview') {
    editorContainer.classList.add('preview-only');
    editorContainer.classList.remove('editor-only');
  }
}

// Settings modal
function openSettingsModal() {
  settingsModal.classList.add('show');
}

function closeSettingsModal() {
  settingsModal.classList.remove('show');
}

function saveSettings() {
  settings.fontSize = document.getElementById('font-size').value;
  settings.tabSize = parseInt(document.getElementById('tab-size').value);
  settings.autoUpdate = document.getElementById('auto-update').checked;
  settings.theme = document.getElementById('theme-select').value;
  settings.showSidebar = document.getElementById('show-sidebar').checked;
  settings.showLineNumbers = document.getElementById('show-line-numbers').checked;
  
  settings.applySettings();
  settings.saveToLocalStorage();
  
  closeSettingsModal();
  showNotification('Settings saved');
}

function resetSettings() {
  settings.fontSize = '14px';
  settings.tabSize = 2;
  settings.autoUpdate = true;
  settings.theme = 'dark';
  settings.showSidebar = true;
  settings.showLineNumbers = true;
  
  settings.applySettings();
  settings.saveToLocalStorage();
  
  closeSettingsModal();
  showNotification('Settings reset to defaults');
}

// Add file modal
function openAddFileModal() {
  document.getElementById('file-name').value = '';
  document.getElementById('file-type').value = 'js';
  addFileModal.classList.add('show');
}

function closeAddFileModal() {
  addFileModal.classList.remove('show');
}

// Simulated AI responses
function handleAiPrompt() {
  const promptText = aiPrompt.value.trim();
  if (!promptText) return;
  
  // Create user message
  const userMessage = document.createElement('div');
  userMessage.className = 'ai-message';
  userMessage.innerHTML = `
    <div class="ai-avatar" style="background-color: var(--accent-color);">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    </div>
    <div class="ai-message-content">
      <p>${promptText}</p>
    </div>
  `;
  
  // Add user message to chat
  const aiContent = document.querySelector('.ai-content');
  aiContent.appendChild(userMessage);
  
  // Clear input
  aiPrompt.value = '';
  
  // Simulate AI thinking
  setTimeout(() => {
    // Create AI response
    const aiResponse = document.createElement('div');
    aiResponse.className = 'ai-message';
    
    // Generate a response based on the prompt
    let responseText = '';
    if (promptText.toLowerCase().includes('hello') || promptText.toLowerCase().includes('hi')) {
      responseText = 'Hello! How can I help you with your code today?';
    } else if (promptText.toLowerCase().includes('help')) {
      responseText = 'I\'m here to help! You can ask me questions about HTML, CSS, JavaScript, or how to implement specific features.';
    } else if (promptText.toLowerCase().includes('html')) {
      responseText = 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the structure of web content.';
    } else if (promptText.toLowerCase().includes('css')) {
      responseText = 'CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML. It controls the layout and appearance of elements.';
    } else if (promptText.toLowerCase().includes('javascript') || promptText.toLowerCase().includes('js')) {
      responseText = 'JavaScript is a programming language that adds interactivity to your website. It can manipulate the DOM, handle events, and much more.';
    } else {
      responseText = 'I understand your question about "' + promptText + '". Let me help you with that. What specific aspects are you interested in?';
    }
    
    aiResponse.innerHTML = `
      <div class="ai-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="4.5"/><path d="M7 7h1v1H7z"/><path d="M16 7h1v1h-1z"/><path d="M7 16h1v1H7z"/><path d="M16 16h1v1h-1z"/><rect width="8" height="8" x="8" y="8" rx="2"/></svg>
      </div>
      <div class="ai-message-content">
        <p>${responseText}</p>
      </div>
    `;
    
    // Add AI response to chat
    aiContent.appendChild(aiResponse);
    
    // Scroll to bottom
    aiContent.scrollTop = aiContent.scrollHeight;
  }, 1000);
}

// Editor event listeners
function initEditorListeners() {
  // Text changes in editors
  htmlEditor.addEventListener('input', function() {
    updateLineNumbers(this, htmlLineNumbers);
    fileSystem.updateFile('index.html', this.value);
    if (settings.autoUpdate) {
      updatePreviewDebounced();
    }
  });
  
  cssEditor.addEventListener('input', function() {
    updateLineNumbers(this, cssLineNumbers);
    fileSystem.updateFile('styles.css', this.value);
    if (settings.autoUpdate) {
      updatePreviewDebounced();
    }
  });
  
  jsEditor.addEventListener('input', function() {
    updateLineNumbers(this, jsLineNumbers);
    fileSystem.updateFile('script.js', this.value);
    if (settings.autoUpdate) {
      updatePreviewDebounced();
    }
  });
  
  // Handle tab key in editors
  [htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        // Insert spaces for indentation
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const spaces = ' '.repeat(settings.tabSize);
        
        this.value = this.value.substring(0, start) + spaces + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + spaces.length;
        
        // Update file content and preview
        if (this === htmlEditor) {
          updateLineNumbers(this, htmlLineNumbers);
          fileSystem.updateFile('index.html', this.value);
        }
        if (this === cssEditor) {
          updateLineNumbers(this, cssLineNumbers);
          fileSystem.updateFile('styles.css', this.value);
        }
        if (this === jsEditor) {
          updateLineNumbers(this, jsLineNumbers);
          fileSystem.updateFile('script.js', this.value);
        }
        
        if (settings.autoUpdate) {
          updatePreviewDebounced();
        }
      }
    });
  });
  
  // View Controls
  viewBtns.forEach(btn => {
    btn.addEventListener('click', handleViewChange);
  });
  
  // Buttons
  resetBtn.addEventListener('click', resetToDefaults);
  clearBtn.addEventListener('click', clearAll);
  refreshPreviewBtn.addEventListener('click', updatePreview);
  runBtn.addEventListener('click', updatePreview);
  copyBtn.addEventListener('click', copyCode);
  downloadBtn.addEventListener('click', downloadCode);
  
  // AI
  aiBtn.addEventListener('click', toggleAiSidebar);
  aiCloseBtn.addEventListener('click', toggleAiSidebar);
  aiSendBtn.addEventListener('click', handleAiPrompt);
  aiPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiPrompt();
    }
  });
  
  // Settings
  settingsBtn.addEventListener('click', openSettingsModal);
  settingsClose.addEventListener('click', closeSettingsModal);
  settingsSave.addEventListener('click', saveSettings);
  settingsReset.addEventListener('click', resetSettings);
  
  // Add File
  addFileBtn.addEventListener('click', openAddFileModal);
  addFileClose.addEventListener('click', closeAddFileModal);
  addFileCancel.addEventListener('click', closeAddFileModal);
  addFileSave.addEventListener('click', createNewFile);
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
          !document.querySelector('.editor-container').classList.contains('preview-only')) {
        if (!editorsPanel.style.width) {
          editorsPanel.style.width = '50%';
        }
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
