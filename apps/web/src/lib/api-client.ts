import { ApiResponse } from '@swasthya/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('swasthya_access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: 'Failed to parse JSON response',
    }));

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('swasthya_access_token');
        localStorage.removeItem('swasthya_user');
        localStorage.removeItem('swasthya_refresh_token');
        
        // If not already on login page, softly redirect with target query parameter
        if (!window.location.pathname.startsWith('/login') && window.location.pathname !== '/') {
          const redirectPath = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?redirect=${redirectPath}&reason=expired`;
        }
      }
      throw new ApiError('Your session has expired. Please log in again.', 401, 'UNAUTHORIZED');
    }

    if (!res.ok || !data.success) {
      throw new ApiError(
        data.message || `Request failed with status ${res.status}`,
        res.status,
        data.code,
      );
    }

    return data.data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.message || 'Unable to connect to Swasthya+ backend services',
      500,
      'NETWORK_ERROR',
    );
  }
}
