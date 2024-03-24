'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (!user) {
          // If user is not signed in, redirect to the home page
          router.push('/');
        }
      });

      return () => unsubscribe();
    }, []);

    return user ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default ProtectedRoute;
