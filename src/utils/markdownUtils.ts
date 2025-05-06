
/**
 * Simple markdown to HTML converter
 * @param markdown The markdown text to convert
 * @returns HTML representation of the markdown
 */
export const convertMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/<\/li>\n<li>/g, '</li><li>')
    .replace(/<\/li>\n*$/g, '</li></ul>')
    .replace(/^<li>/g, '<ul><li>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Code blocks - fixed escaping
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code - fixed escaping
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gm, function(m) {
      return /<(\/)?(h|ul|ol|li|blockquote|pre|img|code)/.test(m) ? m : '<p>' + m + '</p>';
    })
    .replace(/\n/g, '<br />');
};
