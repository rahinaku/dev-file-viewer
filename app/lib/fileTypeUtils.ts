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

export function getMimeType(filePath: string): string {
  const ext = filePath.toLowerCase().split('.').pop() || '';
  
  // Video MIME types - Safari compatible
  switch (ext) {
    case 'mp4': return 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    case 'webm': return 'video/webm; codecs="vp8, vorbis"';
    case 'mov': return 'video/quicktime';
    case 'avi': return 'video/x-msvideo';
    case 'mkv': return 'video/x-matroska';
    
    // Audio MIME types - Safari compatible
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'aac': return 'audio/aac';
    case 'flac': return 'audio/flac';
    case 'm4a': return 'audio/mp4; codecs="mp4a.40.2"';
    case 'ogg': return 'audio/ogg; codecs="vorbis"';
    
    default: return '';
  }
}

export function getSafariCompatibleMimeType(filePath: string): string {
  const ext = filePath.toLowerCase().split('.').pop() || '';
  
  // Simplified MIME types for better Safari compatibility
  switch (ext) {
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'aac': return 'audio/aac';
    case 'm4a': return 'audio/mp4';
    
    default: return getMimeType(filePath);
  }
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