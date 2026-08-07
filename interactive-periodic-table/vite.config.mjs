// FILE: vite.config.js (Final and Corrected Version)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  
  // This section tells the Vite development server how to handle API requests.
  server: {
    proxy: {
      
      // It tells Vite: "If you see any request that starts with '/api'..."
      '/api': {
        // "...forward that request to my backend server running on port 4000."
        target: 'http://localhost:4000', 
        
        // This is a required setting for the proxy to work correctly.
        changeOrigin: true,
      },
    }
  }
});