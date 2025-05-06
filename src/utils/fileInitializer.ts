import { defaultFiles } from './defaultFiles';
import { FileType, FilesState } from '@/types/file';

/**
 * Initialize a new project with default files if no files exist.
 * @param existingFiles The current files object
 * @returns The files object with default files added if needed
 */
export const initializeDefaultFiles = (existingFiles: Record<string, FileType>) => {
  // Check if we have any files
  const hasFiles = Object.keys(existingFiles).length > 0;
  
  // If we don't have files, return the default files
  if (!hasFiles) {
    const initializedFiles: Record<string, FileType> = {};
    
    Object.entries(defaultFiles).forEach(([filename, fileData]) => {
      initializedFiles[filename] = fileData;
    });
    
    return initializedFiles;
  }
  
  // Otherwise just return the existing files
  return existingFiles;
};
