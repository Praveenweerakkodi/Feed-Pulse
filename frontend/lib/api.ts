/**
 * API Client — lib/api.ts
 *
 * This file handles all communication between our Next.js frontend
 * and our Node.js/Express backend.
 *
 * It uses Axios to make HTTP requests and automatically attaches
 * the admin JWT token if one exists in cookies.
 */

import axios from 'axios';

// Get the backend URL from environment variables, fallback to localhost for dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create a configured axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // This tells axios to send cookies with cross-origin requests
  withCredentials: true,
});

// ---- Request Interceptor ----
// Before every request, this intercepts it and attaches the JWT token
// if we have one. We check cookies for 'admin_token'.
api.interceptors.request.use(
  (config) => {
    // Only run this code in the browser (document is undefined on server side)
    if (typeof document !== 'undefined') {
      // Find the admin_token cookie
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find(row => row.startsWith('admin_token='));
      
      if (tokenCookie) {
        // Extract just the token value
        const token = tokenCookie.split('=')[1];
        // Attach it as a Bearer token
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor ----
// Catches global errors like 401 Unauthorized (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401, the user's session expired or token is invalid
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Clear the bad token
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
