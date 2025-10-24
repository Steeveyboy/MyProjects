import React from 'react';
import { signIn } from 'next-auth/react';

const Login = () => {
  const handleSignIn = async () => {
    try {
      let res = await signIn('google', { callbackUrl: '/welcome' });
    } catch (error) {
      console.error('Sign in failed:', error);
      // Handle sign-in error (e.g., show a notification)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-1">Welcome to Todo App</h1>
        
        <p className="text-gray-600 mb-4 text-center">
          Sign in or create an account to manage your todos.
        </p>
        
        <button
          onClick={() => handleSignIn()}
          className="flex items-center justify-center w-full p-2 space-x-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg 
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
