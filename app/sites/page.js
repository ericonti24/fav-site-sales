'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, firestore, storage } from '@/app/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
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
  const [showDropdowns, setShowDropdowns] = useState(Array(sites.length).fill(false));
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        console.log('User ID:', user.uid);
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
      console.log("Verify User ID:", userId);
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
  
      // Construct reference to the user's folder
      const userSitesCollectionRef = collection(firestore, 'users', userId, 'sites');
  
      // Get all documents from the user's "sites" collection
      const querySnapshot = await getDocs(userSitesCollectionRef);
  
      // Initialize an array to hold fetched sites
      const fetchedSites = [];
  
      // Loop through each document in the query snapshot
      querySnapshot.forEach(doc => {
        fetchedSites.push({ id: doc.id, ...doc.data() });
        console.log("Fetched site:", { id: doc.id, ...doc.data() });
      });
  
      // Set the state variable to the fetched sites
      setSites(fetchedSites);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };
  
  const handleAddSite = async () => {
    try {
      if (!currentUser) {
        console.error('Current user is undefined');
        return;
      }
  
      if (!siteName || !url || !imageFile) {
        console.error('All fields are required');
        return;
      }
  
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${currentUser.uid}/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progress tracking if needed
        }, 
        (error) => {
          console.error('Error uploading image:', error);
        }, 
        () => {
          // Image uploaded successfully, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Save site data including userId and imageUrl in Firestore
            const siteData = {
              imageUrl: downloadURL,
              siteName: siteName,
              url: url,
              userId: currentUser.uid
            };
  
            // Construct reference to the user's folder
            const userFolderRef = collection(firestore, 'users', currentUser.uid, 'sites');
  
            // Add site data to Firestore
            addDoc(userFolderRef, siteData)
              .then((docRef) => {
                console.log('Document written with ID:', docRef.id);
                // Clear form fields and state
                setSiteName('');
                setUrl('');
                setImageFile(null);
                setImageUrl('');
                setShowModal(false);
                // Fetch updated sites
                fetchSites(currentUser.uid);
              })
              .catch((error) => {
                console.error('Error adding document:', error);
              });
          }).catch((error) => {
            console.error('Error getting download URL:', error);
          });
        }
      );
    } catch (error) {
      console.error('Error uploading site:', error);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRemoveSite = async (siteId, imageUrl) => {
    try {
      // Delete the image file from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
  
      // Delete the document representing the site from Firestore
      await deleteDoc(doc(firestore, 'sites', siteId));
  
      // Update the state to remove the deleted site
      setSites(sites.filter(site => site.id !== siteId));
    } catch (error) {
      console.error('Error removing site:', error);
    }
  };
  

  const toggleDropdown = (index) => {
    setShowDropdowns((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
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
        <div className='text-center'>
          <h1 className="text-2xl font-bold mb-4">Sites</h1>
          <p className='mb-4'>Save your favorite site that has sales here. </p>
          <p className='mb-4'> Click Add a new site to add the site name, photo of your choosing and the url of the sales page of your favorite site.</p>
          <p className='mb-8'>Then click on your uploaded url to view and save on your favorite site!</p>
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8">Add a new site</button>
        </div>
      <div className="w-full max-w-md">
        {sites.map((site, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow mb-8">
            {/* Your dropdown and site information */}
            <div className="flex justify-end px-4 pt-2">
              <div className="relative">
                <button
                  id={`dropdownButton${index}`}
                  className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                  type="button"
                  onClick={() => toggleDropdown(index)}
                >
                  <span className="sr-only">Open dropdown</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 3"
                  >
                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                  </svg>
                </button>
                {/* Dropdown menu */}
                <div
                  id={`dropdown${index}`}
                  className={`absolute right-0 top-full ${
                    showDropdowns[index] ? "block" : "hidden"
                  } z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
                >
                  <ul className="py-2" aria-labelledby={`dropdownButton${index}`}>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => handleRemoveSite(site.id)}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Site information */}
            <div className="flex items-center space-x-6 px-2 py-1 pb-6">
              {site.imageUrl && (
                <img
                  className="w-40 h-22 rounded-lg object-cover object-center shadow-lg"
                  src={site.imageUrl}
                  alt="Site image"
                />
              )}
              <div className="flex flex-col flex-grow">
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-black">
                  {site.siteName}
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {site.role}
                </span>
                <div className="flex mt-4 md:mt-6">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Go to Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black">Add a New Site</h2>
            <div className="mb-4">
              <label htmlFor="siteName" className="block font-semibold mb-2 text-black">Site Name:</label>
              <input type="text" id="siteName" value={siteName} onChange={handleSiteNameChange} className="w-full border rounded px-3 py-2 text-black" />
              {showError && !siteName && <p className="text-red-500 mt-1">Site Name is required</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block font-semibold mb-2 text-black">Add Photo:</label>
              <input type="file" id="image" onChange={handleImageUpload} />
              {imageUrl && (
                <div className="flex items-center mt-2">
                  {imageFile && imageFile.name &&
                    <p className="text-gray-500 mr-2">{imageFile.name}</p>
                  }
                  <button onClick={handleRemoveImage} className="bg-red-600 text-black px-1 py-1 rounded hover:bg-red-700">Remove</button>
                </div>
              )}
              {showError && !imageFile && <p className="text-red-500 mt-1">Image is required</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="url" className="block font-semibold mb-2 text-black">URL Link:</label>
              <input type="text" id="url" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2 text-black" />
              {showError && !url && <p className="text-red-500 mt-1">URL Link is required</p>}
            </div>
            <div className="flex justify-end">
              <button onClick={() => { setShowError(true); handleAddSite(); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Site</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-4 hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute(Sites);
