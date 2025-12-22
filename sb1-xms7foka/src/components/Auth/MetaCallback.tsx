import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function MetaCallback() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  );

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          setError(errorDescription || error);
          setStatus('error');
          return;
        }

        // Wait a moment to ensure auth state is updated
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (user) {
          setStatus('success');
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setError('Authentication failed. Please try again.');
          setStatus('error');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An unexpected error occurred during authentication.');
        setStatus('error');
      }
    };

    handleCallback();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Authentication
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your sign-in...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Successful!
              </h2>
              <p className="text-gray-600">Redirecting to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'An error occurred during authentication.'}
              </p>
              <button
                onClick={() => (window.location.href = '/')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
