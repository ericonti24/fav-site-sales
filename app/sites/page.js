'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, firestore, storage } from '@/app/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ProtectedRoute from '../components/ProtectedRoute'

const Sites = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [url, setUrl] = useState('');
  const [sites, setSites] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        fetchSites(user.uid);
      } else {
        console.log('User not signed in. Redirecting...');
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchSites = async (userId) => {
    try {
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
      const querySnapshot = await getDocs(query(collection(firestore, 'sites'), where('userId', '==', userId)));
      const fetchedSites = [];
      querySnapshot.forEach(doc => {
        fetchedSites.push({ id: doc.id, ...doc.data() });
      });
      setSites(fetchedSites);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl('');
  };

  const handleSiteNameChange = (e) => {
    setSiteName(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleAddSite = async () => {
    try {
      // Checks if currentUser is defined before accessing its properties
      if (!currentUser) {
        console.error('Current user is undefined');
        return;
      }

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      const snapshot = await uploadTask;

      // Get download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save site data including download URL in Firestore
      const siteData = {
        siteName: siteName,
        url: url,
        imageUrl: downloadURL, // Save download URL
        userId: currentUser.uid
      };
      await addDoc(collection(firestore, 'sites'), siteData);

      // Clear form fields and state
      setSiteName('');
      setUrl('');
      setImageFile(null);
      setImageUrl('');
      setShowModal(false);

      // Fetch updated sites
      fetchSites(currentUser.uid); 
    } catch (error) {
      console.error('Error uploading site:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleRemoveSite = async (siteId) => {
    try {
      await deleteDoc(doc(firestore, 'sites', siteId));
      setSites(sites.filter(site => site.id !== siteId));
    } catch (error) {
      console.error('Error removing site:', error);
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Fav Sites Sales</h1>
        <div className="flex flex-col items-end">
          {currentUser && (<p className="text-white mb-2">{currentUser.displayName || currentUser.email}</p>)}
          <button onClick={handleSignOut} className="text-white bg-gray-600 hover:bg-gray-700 py-1 px-1 rounded">Sign Out</button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Sites</h1>
    
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add a new site</button>
    
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Uploaded Sites:</h2>
          <ul>
            {sites.map((site, index) => (
              <li key={index} className="mb-2">
                <div>
                  {site.imageUrl && <img src={site.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
                  <p className="font-semibold">{site.siteName}</p>
                  <a href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</a>
                  <button onClick={() => handleRemoveSite(site.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black">Add a New Site</h2>
            <div className="mb-4">
              <label htmlFor="siteName" className="block font-semibold mb-2 text-black">Site Name:</label>
              <input type="text" id="siteName" value={siteName} onChange={handleSiteNameChange} className="w-full border rounded px-3 py-2 text-black" />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block font-semibold mb-2 text-black">Add Photo:</label>
              <input type="file" id="image" onChange={handleImageUpload} />
              {imageUrl && (
                <div className="flex items-center mt-2">
                  <p className="text-gray-500 mr-2">{imageFile.name}</p>
                  <button onClick={handleRemoveImage} className="bg-red-600 text-black px-1 py-1 rounded hover:bg-red-700">Remove</button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="url" className="block font-semibold mb-2 text-black">URL Link:</label>
              <input type="text" id="url" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2 text-black" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddSite} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Site</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-4 hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute(Sites);





