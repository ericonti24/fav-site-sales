'use client'
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, app } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter();
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        router.push('./sigh-in')
      }
    })
    return () => unsubscribe()
  }, [auth, router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/sign-in')
    } catch (error) {
      console.error(error.message)
    }
  }

  console.log({user})

  if (!user) {
    return null; 
  }

  return (
    <>
      <header className="bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 lg:px-0">
          <h1 className="text-2xl text-gray-800 dark:text-white">Favorite Site Sales</h1>
          <button onClick={handleSignOut} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">Log out</button>
        </div>
      </header>
      <div>{user.displayName || user.email}</div>
    </>
  )
}

