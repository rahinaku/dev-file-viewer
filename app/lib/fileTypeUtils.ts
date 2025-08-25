export function getFileApiEndpoint(filePath: string): string {
  const ext = filePath.toLowerCase().split('.').pop() || '';
  
  // Image extensions
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return '/api/image';
  }
  
  // Audio extensions
  if (['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(ext)) {
    return '/api/audio';
  }
  
  // Video extensions
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
    return '/api/video';
  }
  
  // Default to image for backward compatibility
  return '/api/image';
}

export function getFileType(filePath: string): 'image' | 'audio' | 'video' | 'other' {
  const ext = filePath.toLowerCase().split('.').pop() || '';
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return 'image';
  }
  
  if (['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(ext)) {
    return 'audio';
  }
  
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
    return 'video';
  }
  
  return 'other';
}