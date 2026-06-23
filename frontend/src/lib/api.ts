export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Create cache key
  const cacheKey = `${endpoint}-${token}`;
  const method = options.method || 'GET';
  
  // Check cache for GET requests only
  if (method === 'GET' && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add any additional headers from options
  if (options.headers && typeof options.headers === 'object') {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    // Enable keep-alive for better performance
    keepalive: true,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  // Cache GET requests
  if (method === 'GET') {
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    // Cleanup old cache entries
    if (cache.size > 50) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
  } else {
    // Invalidate cache on mutations
    for (const key of cache.keys()) {
      if (key.startsWith(endpoint.split('/')[0])) {
        cache.delete(key);
      }
    }
  }

  return data;
};
