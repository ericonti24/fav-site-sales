'use client'
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from './firebase/config';

const Home = () => {

  const router = useRouter();
  const [error, setError] = useState("")
  const [userCredentials, setUserCredentials] = useState({})

  function handleCredentials(e) {
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
  }
  
  function handleSignIn(e) {
    e.preventDefault()
    setError("")
    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem('user', true);
        router.push('/sites');
        console.log(userCredential.user);
      })
      .catch((error) => {
        setError(error.message)
    });
  }
   

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/sites');
    } catch (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-white text-4xl mb-8">Favorite Site Sales</h1>
      <p className='text-center'>Have a favorite shopping site that has sales?</p>
      <p className='text-center'>Now you can have quicker access to that page.</p>
      <p className='text-center mb-8'>Save and view. </p>
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h2 className="text-white text-2xl mb-5">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          name='email'
          onChange={(e) => {handleCredentials(e)}}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          name='password'
          placeholder="Password"
          onChange={(e) => {handleCredentials(e)}}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-400"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={(e) => {handleSignIn(e)}}
          className="w-full p-3 bg-green-600 rounded text-white hover:bg-green-500"
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
          className="w-full p-3 bg-blue-600 rounded text-white hover:bg-blue-500 mt-4"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Home;



