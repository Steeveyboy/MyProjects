import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService'; // Adjust the import path as necessary

const Welcome = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [backendVerified, setBackendVerified] = useState(false);


  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!session) {
      router.push('/login');
      return;
    }
    
    // If user is authenticated but not a new user, redirect to main page
    // We need to handle the custom type for isNewUser property
    const userSession = session as any;
    if (userSession && userSession.user && !userSession.user.isNewUser) {
      router.push('/');
    }

    // Verify the token with backend
    if (session) {
      const verifyToken = async () => {
        try {
          const result = await authService.verifyGoogleToken();
          console.log('Token verified with backend:', result);
          setBackendVerified(true);
        } catch (error) {
          console.error('Backend verification failed:', error);
        }
      };

      verifyToken();
    }

  }, [session, router]);

  // useEffect(() => {
  //   if (session) {
  //     setIsLoading(false);
  //     };

  //     verifyToken();
  //   }
  // }, [session]);

  // }, [session, router]);

  useEffect(() => {
    if (session) {
      setIsLoading(false);
    }
  }, [session]);

  if (!session || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-8">
          {session.user?.image && (
            <div className="relative w-20 h-20 mx-auto overflow-hidden rounded-full">
              <img 
                src={session.user.image} 
                alt={session.user?.name || 'User'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">Thank You for Signing Up!</h1>
        
        <p className="text-gray-600 mb-8">
          Welcome, <span className="font-semibold">{session.user?.name || 'User'}</span>! Your account has been successfully created.
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Get Started with Your Todo List
        </button>
      </div>
    </div>
  );
};

export default Welcome;
