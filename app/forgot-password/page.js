'use client'
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
    if (value.trim() === '') {
      setError('Email is required');
    } else {
      setError('');
    }
  }

  const triggerResetEmail = async () => {
    if (isValidEmail) {
      await sendPasswordResetEmail(auth, email);
      setEmail('');
      setToastMessage('Password reset email sent');
    } else {
      setError('Please enter a valid email');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <h1 className="text-white text-4xl mb-8">Favorite Site Sales</h1>
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
            <h2 className="text-white text-2xl mb-2">Forgot Password</h2>
            <p className="text-white text-sm mb-4">Enter your email below to receive a password reset link.</p>
            <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={handleEmailChange} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <button 
            onClick={triggerResetEmail}
            disabled={!isValidEmail} 
            className={`w-full p-3 bg-indigo-600 rounded text-white ${isValidEmail ? 'hover:bg-indigo-500' : 'cursor-not-allowed'}`}
            >
            Submit
            </button>

            <p className="text-white text-center mt-4">Already have an account? <a href="/sign-in" className="text-indigo-400">Sign In</a></p>
        </div>
        {toastMessage && (
          <div className="fixed bottom-0 right-0 mb-4 mr-4 bg-gray-800 text-white py-2 px-4 rounded">
            {toastMessage}
          </div>
        )}
    </div>
  );
};

export default ForgotPassword;
