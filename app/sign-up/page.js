'use client';
import { useState } from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [userCredentials, setUserCredentials] = useState({})

  function handleCredentials(e) {
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
  }
  
  function handleSignUp(e) {
    e.preventDefault();
    setError("")
    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    .then((userCredential) => {
      const user = userCredential.user;
      sessionStorage.setItem('user', true);
      router.push('/sites');
    })
    .catch((error) => {
      setError(error.message)
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <form >
          <input 
            type="email" 
            name='email'
            placeholder="Email" 
            onChange={(e) => {handleCredentials(e)}} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <input 
            type="password" 
            name='password'
            placeholder="Password" 
            onChange={(e) => handleCredentials(e)} 
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button 
            onClick={(e) => {handleSignUp(e)}}
            type='submit'
            className="w-full p-3 bg-green-600 rounded text-white hover:bg-green-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-white text-center mt-4">Already have an account? <a href="/" className="text-indigo-400">Sign In</a></p>
      </div>
    </div>
  );
};

export default SignUp;
