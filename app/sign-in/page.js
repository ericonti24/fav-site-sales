'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { getAuth } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase/config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.trim() !== '';
  };

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!validatePassword(password)) {
      setError('Please enter a password');
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-white text-4xl mb-8">Favorite Site Sales</h1>
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h2 className="text-white text-2xl mb-5">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
        <p className="text-white text-center mt-4">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-indigo-400">
            Sign Up
          </a>
        </p>
        <p className="text-white text-center mt-4">
          Forgot Password?{' '}
          <a href="/forgot-password" className="text-indigo-400">
            Reset Password
          </a>
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full p-3 bg-red-600 rounded text-white hover:bg-red-500 mt-4"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;