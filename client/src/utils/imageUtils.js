export const parseImages = (imgs) => {
  if (!imgs) return [];
  if (typeof imgs === 'string') {
    try {
      return JSON.parse(imgs);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(imgs) ? imgs : [];
};

export const getImageUrl = (path) => {
  if (
    !path ||
    path === 'null' ||
    path === 'undefined' ||
    String(path).trim() === ''
  )
    return null;
    
  if (typeof path === 'string') {
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    let cleanPath = path;
    if (cleanPath.startsWith('public/'))
      cleanPath = cleanPath.replace('public/', '');
    else if (cleanPath.startsWith('/public/'))
      cleanPath = cleanPath.replace('/public/', '');
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

    const baseUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
      : 'http://localhost:8000';
      
    return `${baseUrl}/storage/${cleanPath}`;
  }
  return null;
};
