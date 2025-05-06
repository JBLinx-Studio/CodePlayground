import { defaultFiles } from './defaultFiles';

/**
 * Initialize a new project with default files if no files exist.
 * @param existingFiles The current files object
 * @returns The files object with default files added if needed
 */
export const initializeDefaultFiles = (existingFiles: Record<string, { content: string }>) => {
  // Check if we have any files
  const hasFiles = Object.keys(existingFiles).length > 0;
  
  // If we don't have files, return the default files
  if (!hasFiles) {
    const initializedFiles: Record<string, { content: string }> = {};
    
    Object.entries(defaultFiles).forEach(([filename, content]) => {
      initializedFiles[filename] = { content };
    });
    
    return initializedFiles;
  }
  
  // Otherwise just return the existing files
  return existingFiles;
};
