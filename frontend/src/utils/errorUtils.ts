/**
 * Handles API errors and returns a user-friendly error message
 * 
 * @param error - The error object from the API request
 * @returns User-friendly error message
 */
export const handleApiError = (error: any): string => {
  // Check if the error is an Axios error with a response
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle common HTTP status codes
    switch (status) {
      case 400:
        return data.message || 'Invalid request. Please check your data.';
      case 401:
        return 'You need to be logged in to perform this action.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your inputs.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || `Error: ${status}`;
    }
  } 
  // Handle network errors
  else if (error.request) {
    return 'Network error. Please check your internet connection.';
  } 
  // Handle other errors
  else {
    return error.message || 'An unexpected error occurred.';
  }
};
