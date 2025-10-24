import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const authService = {
  /**
   * Verifies the user's Google ID token with the backend
   */
  verifyGoogleToken: async () => {
    try {
      // Get the current session to access the ID token
      const session = await getSession();
      
      if (!session?.idToken) {
        throw new Error('No ID token available');
      }
      
      // Send the ID token to the backend for verification
      const response = await axios.post(`${API_URL}/auth/google`, {
        idToken: session.idToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.idToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error verifying token with backend:', error);
      // throw error;
      return {}
    }
  }
};
