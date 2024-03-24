'use client'

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth } from '@/app/firebase/config';
// import ProtectedRoute from '@/app/components/ProtectedRoute';

// const Sites = () => {
//   const router = useRouter();
//   const [imageFile, setImageFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState('');
//   const [url, setUrl] = useState('');
//   const [sites, setSites] = useState([]);
//   const [selectedSiteIndex, setSelectedSiteIndex] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setCurrentUser(user);
//       } else {
//         router.push('/sign-in');
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//     setImageUrl('');
//   };

//   const handleRemoveImage = () => {
//     setImageFile(null);
//     setImageUrl('');
//   };

//   const handleUrlChange = (e) => {
//     setUrl(e.target.value);
//   };

//   const handleAddSite = () => {
//     if (imageFile && url) {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setImageUrl(reader.result);
//       };

//       reader.readAsDataURL(imageFile);

//       setSites([...sites, { imageUrl, url }]);
//       setImageFile(null);
//       setImageUrl('');
//       setUrl('');
//     }
//   };

//   const handleEditSite = (index) => {
//     setSelectedSiteIndex(index);
//     setModalOpen(true);
//   };

//   const handleSaveChanges = () => {
//     if (selectedSiteIndex !== null) {
//       const updatedSites = [...sites];
//       updatedSites[selectedSiteIndex] = { imageUrl, url };
//       setSites(updatedSites);
//       setModalOpen(false);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/sign-in');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   console.log(url, imageFile);

//   return (
//     <div>
//       <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
//         <h1 className="text-white text-2xl font-bold">Fav Sites Sales</h1>
//         <div className="flex flex-col items-end">
//           {currentUser && (<p className="text-white mb-2">{currentUser.displayName || currentUser.email}</p>)}
//           <button onClick={handleSignOut} className="text-white bg-gray-600 hover:bg-gray-700 py-1 px-1 rounded">Sign Out</button>
//         </div>
//       </nav>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-4">Sites</h1>

//         <div className="mb-4">
//           <label htmlFor="image" className="block font-semibold mb-2">Image:</label>
//           <input type="file" id="image" onChange={handleImageUpload} />
//           {imageFile && (
//             <div className="flex items-center mt-2">
//               <p className="text-gray-500 mr-2">{imageFile.name}</p>
//               <button onClick={handleRemoveImage} className="bg-red-600 text-white px-1 py-1 rounded hover:bg-red-700">Remove</button>
//             </div>
//           )}
//         </div>
//         <div className="mb-4">
//           <label htmlFor="url" className="block font-semibold mb-2">URL:</label>
//           <input type="text" id="url" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2 text-black" />
//         </div>

//         <button onClick={handleAddSite} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Site</button>

//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-2">Uploaded Sites:</h2>
//           <ul>
//             {sites.map((site, index) => (
//               <li key={index} className="mb-2">
//                 <div>
//                   <img src={site.imageUrl} alt="Uploaded" className="w-24 h-24 mr-2 inline-block" />
//                   <a href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</a>
//                   <button onClick={() => handleEditSite(index)} className="ml-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600">Edit</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Edit Site</h2>
//             <div className="mb-4">
//               <label htmlFor="editImage" className="block font-semibold mb-2">Image:</label>
//               <input type="file" id="editImage" onChange={handleImageUpload} />
//               {imageFile && (
//                 <div className="flex items-center mt-2">
//                   <p className="text-gray-500 mr-2">{imageFile.name}</p>
//                   <button onClick={handleRemoveImage} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Remove</button>
//                 </div>
//               )}
//             </div>
//             {imageUrl && (
//               <div className="mb-4">
//                 <img src={imageUrl} alt="Uploaded" className="max-w-full" />
//               </div>
//             )}
//             <div className="mb-4">
//               <label htmlFor="editUrl" className="block font-semibold mb-2">URL:</label>
//               <input type="text" id="editUrl" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2" />
//             </div>
//             <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
//             <button onClick={() => setModalOpen(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProtectedRoute(Sites);


// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, firestore } from '@/app/firebase/config';
// import { collection, addDoc } from 'firebase/firestore';
// import ProtectedRoute from '@/app/components/ProtectedRoute';

// const Sites = () => {
//   const router = useRouter();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState('');
//   const [url, setUrl] = useState('');
//   const [sites, setSites] = useState([]);
//   const [selectedSiteIndex, setSelectedSiteIndex] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editImageFile, setEditImageFile] = useState(null)

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setCurrentUser(user);
//       } else {
//         console.log('User not signed in. Redirecting...');
//         router.push('/');
//       }
//     });
  
//     return () => unsubscribe();
//   }, [router]);    

//   const handleMainImageUpload = async (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };

//   const handleEditImageUpload = (e) => {
//     const file = e.target.files[0]
//     setEditImageFile(file)
//     try {
//     } catch (error) {
//         console.error('Error uploading image:', error);
//     }
//   }

//   const handleRemoveImage = () => {
//     setImageFile(null);
//     setImageUrl('');
//   };

//   const handleUrlChange = (e) => {
//     setUrl(e.target.value);
//   };

// const handleAddSite = async () => {
//     if (imageFile && url) {
//       try {
//         // Add site document to Firestore with image URL and file name
//         const docRef = await addDoc(collection(firestore, 'sites'), {
//           imageFileName: imageFile.name,
//           imageUrl: url,
//           userId: currentUser.uid // Set userId field to current user's UID
//         });
        
//         // Update local state with the new site
//         setSites([...sites, { id: docRef.id, imageUrl: url, imageFileName: imageFile.name }]);
        
//         // Reset input fields and state
//         setImageFile(null);
//         setUrl('');
//       } catch (error) {
//         console.error('Error adding site:', error);
//       }
//     }
//   };
  

//   const handleEditSite = (index) => {
//     setSelectedSiteIndex(index);
//     setModalOpen(true);
//   };

//   const handleSaveChanges = async () => {
//     if (selectedSiteIndex !== null) {
//       try {
//         const siteToUpdate = sites[selectedSiteIndex];
//         // Update site logic
//         setModalOpen(false);
//       } catch (error) {
//         console.error('Error updating site:', error);
//       }
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <div>
//   <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
//     <h1 className="text-white text-2xl font-bold">Fav Sites Sales</h1>
//     <div className="flex flex-col items-end">
//       {currentUser && (<p className="text-white mb-2">{currentUser.displayName || currentUser.email}</p>)}
//       <button onClick={handleSignOut} className="text-white bg-gray-600 hover:bg-gray-700 py-1 px-1 rounded">Sign Out</button>
//     </div>
//   </nav>
//   <div className="container mx-auto px-4 py-8">
//     <h1 className="text-2xl font-bold mb-4">Sites</h1>

//     <div className="mb-4">
//       <label htmlFor="image" className="block font-semibold mb-2">Image:</label>
//       <input type="file" id="image" onChange={handleMainImageUpload} />
//       {imageFile && (
//         <div className="flex items-center mt-2">
//           <p className="text-gray-500 mr-2">{imageFile.name}</p>
//           <button onClick={handleRemoveImage} className="bg-red-600 text-white px-1 py-1 rounded hover:bg-red-700">Remove</button>
//         </div>
//       )}
//     </div>

//     <div className="mb-4">
//       <label htmlFor="url" className="block font-semibold mb-2">URL:</label>
//       <input type="text" id="url" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2 text-black" />
//     </div>

//     <button onClick={handleAddSite} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Site</button>

//     <div className="mt-8">
//       <h2 className="text-xl font-semibold mb-2">Uploaded Sites:</h2>
//       <ul>
//         {sites.map((site, index) => (
//           <li key={index} className="mb-2">
//             <div>
//               <img src={site.imageUrl} alt="Uploaded" className="w-24 h-24 mr-2 inline-block" />
//               <a href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</a>
//               <button onClick={() => handleEditSite(index)} className="ml-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600">Edit</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>

//   {modalOpen && (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-4 rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">Edit Site</h2>
//         <div className="mb-4">
//           <label htmlFor="editImage" className="block font-semibold mb-2">Image:</label>
//           <input type="file" id="editImage" onChange={handleEditImageUpload} />
//           {imageFile && (
//             <div className="flex items-center mt-2">
//               <p className="text-gray-500 mr-2">{imageFile.name}</p>
//               <button onClick={handleRemoveImage} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Remove</button>
//             </div>
//           )}
//         </div>

//         {imageUrl && (
//           <div className="mb-4">
//             <img src={imageUrl} alt="Uploaded" className="max-w-full" />
//           </div>
//         )}

//         <div className="mb-4">
//           <label htmlFor="editUrl" className="block font-semibold mb-2">URL:</label>
//           <input type="text" id="editUrl" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2" />
//         </div>

//         <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
//         <button onClick={() => setModalOpen(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
//       </div>
//     </div>
//   )}
// </div>

//   );
// };

// export default ProtectedRoute(Sites);

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';
// import { auth, firestore } from '@/app/firebase/config';
// import { collection, addDoc, getDocs } from 'firebase/firestore';
// import ProtectedRoute from '@/app/components/ProtectedRoute';

// const Sites = () => {
//   const router = useRouter();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [url, setUrl] = useState('');
//   const [siteName, setSiteName] = useState('');
//   const [sites, setSites] = useState([]);
//   const [showModal, setShowModal] = useState(false); 

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setCurrentUser(user);
//         fetchSites();
//       } else {
//         console.log('User not signed in. Redirecting...');
//         router.push('/');
//       }
//     });
  
//     return () => unsubscribe();
//   }, [router]); 
  
//   const fetchSites = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(firestore, 'sites'));
//       const fetchedSites = [];
//       querySnapshot.forEach(doc => {
//         fetchedSites.push({ id: doc.id, ...doc.data() });
//       });
//       setSites(fetchedSites);
//     } catch (error) {
//       console.error('Error fetching sites:', error);
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     console.log("File selected:", file); // Log selected file to console
//     setImageFile(file);
//   };

//   const handleRemoveImage = () => {
//     setImageFile(null);
//   };

//   const handleUrlChange = (e) => {
//     setUrl(e.target.value);
//   };

//   const handleSiteNameChange = (e) => {
//     setSiteName(e.target.value);
//   };

//   const handleAddSite = async () => {
//     if (imageFile && url && siteName) {
//       try {
//         const docRef = await addDoc(collection(firestore, 'sites'), {
//           imageFileName: imageFile.name,
//           imageUrl: url, //change to url, not imageUrl. not showing after upload
//           userId: currentUser.uid,
//           siteName: siteName
//         });
        
//         setSites([...sites, { id: docRef.id, imageUrl: url, imageFileName: imageFile.name, siteName }]);
        
//         setImageFile(null);
//         setUrl('');
//         setSiteName('');
//         setShowModal(false); // Step 3: Close the modal after adding the site
//       } catch (error) {
//         console.error('Error adding site:', error);
//       }
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // Step 2: Functions to handle opening and closing the modal
//   const openModal = () => {
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };
  
//   return (
//     <div>
//       <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
//         <h1 className="text-white text-2xl font-bold">Fav Sites Sales</h1>
//         <div className="flex flex-col items-end">
//           {currentUser && (<p className="text-white mb-2">{currentUser.displayName || currentUser.email}</p>)}
//           <button onClick={handleSignOut} className="text-white bg-gray-600 hover:bg-gray-700 py-1 px-1 rounded">Sign Out</button>
//         </div>
//       </nav>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-4">Sites</h1>
    
//         <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add a new site</button> {/* Step 4: Open the modal when this button is clicked */}
    
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-2">Uploaded Sites:</h2>
//           <ul>
//             {sites.map((site, index) => (
//               <li key={index} className="mb-2">
//                 <div>
//                   <img src={site.imageUrl} alt="Uploaded" className="w-24 h-24 mr-2 inline-block" />
//                   <p className="font-semibold">{site.siteName}</p>
//                   <a href={site.url} target="_blank" rel="noopener noreferrer">{site.url}</a>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
      
//       {/* Step 3: Modal */}
//         {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
//             <div className="bg-white p-6 rounded-lg">
//             <h2 className="text-2xl font-semibold mb-4">Add a New Site</h2>
//             <div className="mb-4">
//                 <label htmlFor="siteName" className="block font-semibold mb-2 text-black">Site Name:</label>
//                 <input type="text" id="siteName" value={siteName} onChange={handleSiteNameChange} className="w-full border rounded px-3 py-2 text-black" />
//             </div>
//             <div className="mb-4">
//                 <label htmlFor="image" className="block font-semibold mb-2 text-black">Add Photo:</label> {/* Changed label */}
//                 <input type="file" id="image" onChange={handleImageUpload} />
//                 {imageFile && (
//                 <div className="flex items-center mt-2">
//                     <p className="text-gray-500 mr-2">{imageFile.name}</p>
//                     <button onClick={handleRemoveImage} className="bg-red-600 text-white px-1 py-1 rounded hover:bg-red-700">Remove</button>
//                 </div>
//                 )}
//             </div>
//             <div className="mb-4">
//                 <label htmlFor="url" className="block font-semibold mb-2 text-black">URL Link:</label> {/* Changed label */}
//                 <input type="text" id="url" value={url} onChange={handleUrlChange} className="w-full border rounded px-3 py-2 text-black" />
//             </div>
//             <div className="flex justify-end">
//                 <button onClick={handleAddSite} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Site</button>
//                 <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-4 hover:bg-gray-400">Cancel</button>
//             </div>
//             </div>
//         </div>
//         )}

//     </div>
//   );
// };

// export default ProtectedRoute(Sites);

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '@/app/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

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
        fetchSites();
      } else {
        console.log('User not signed in. Redirecting...');
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

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
    if (siteName && imageUrl && url) {
      try {
        const docRef = await addDoc(collection(firestore, 'sites'), {
          imageFileName: imageFile.name,
          imageUrl: imageUrl,
          siteName: siteName,
          url: url,
          userId: currentUser.uid
        });

        setSites([...sites, { id: docRef.id, imageUrl: imageUrl, imageFileName: imageFile.name, siteName: siteName, url: url }]);
        
        setImageFile(null);
        setImageUrl('');
        setSiteName('');
        setUrl('');
        setShowModal(false);
      } catch (error) {
        console.error('Error adding site:', error);
      }
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

  const fetchSites = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'sites'));
      const fetchedSites = [];
      querySnapshot.forEach(doc => {
        fetchedSites.push({ id: doc.id, ...doc.data() });
      });
      setSites(fetchedSites);
    } catch (error) {
      console.error('Error fetching sites:', error);
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
                  {site.imageUrl && <img src={site.imageUrl} alt="Uploaded" className="w-24 h-24 mr-2 inline-block" />}
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

export default Sites;





