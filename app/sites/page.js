'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, firestore, storage } from '@/app/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import ProtectedRoute from '../components/ProtectedRoute'
import Site from '../components/site';
import AddNewSiteForm from '../components/addNewSiteForm';
import EditSiteForm from '../components/editSiteForm';

const Sites = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [url, setUrl] = useState('');
  const [sites, setSites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDropdowns, setShowDropdowns] = useState(sites.map(() => false));
  const [showError, setShowError] = useState(false);
  const [editedSite, setEditedSite] = useState(null);
  const [editedSiteName, setEditedSiteName] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [editError, setEditError] = useState(false);

  const toggleDropdown = (index) => {
    setShowDropdowns((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside of any dropdown menu
      showDropdowns.forEach((dropdownIsOpen, index) => {
        if (!event.target.closest(`#dropdown${index}`) && dropdownIsOpen) {
          toggleDropdown(index);
        }
      });
    };

    // Add event listener to detect clicks on the document
    document.addEventListener('click', handleOutsideClick);

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        console.log('User ID:', user.uid);
        // Check if user ID is defined before fetching sites
        if (user.uid) {
          fetchSites(user.uid);
        } else {
          console.error('User ID is undefined');
        }
      } else {
        console.log('User not signed in. Redirecting...');
        router.push('/');
      }
    });

    return () => {
      // Remove event listener and unsubscribe when component unmounts
      document.removeEventListener('click', handleOutsideClick);
      unsubscribe();
    };
  }, [router, showDropdowns]);
  
  
  

  const fetchSites = async (userId) => {
    try {
      console.log("Verify User ID:", userId);
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
      
      // Path to users data from firestore
      const userSitesCollectionRef = collection(firestore, 'users', userId, 'sites');
  
      // Get all documents from the user's "sites" collection in firestore
      const querySnapshot = await getDocs(userSitesCollectionRef);
  
      // Array to hold fetched sites
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
      setShowError(false); // Reset showError state
  
      if (!currentUser) {
        console.error('Current user is undefined');
        return;
      }
  
      if (!siteName || !url || !imageFile) {
        console.error('All fields are required');
        setShowError(true); // Show error message
        return;
      }
  
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${currentUser.uid}/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
      // Await for the upload task to complete
      await uploadTask;
  
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
  
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
      const docRef = await addDoc(userFolderRef, siteData);
      console.log('Document written with ID:', docRef.id);
  
      // Clear form fields and state
      setSiteName('');
      setUrl('');
      setImageFile(null);
      setImageUrl('');
      setShowModal(false);
  
      // Fetch updated sites
      fetchSites(currentUser.uid);
    } catch (error) {
      console.error('Error adding site:', error);
    }
  };

  const handleEditSite = async () => {
    try {
      setEditError(false); // Reset edit error state

      if (!currentUser || !editedSite || !currentUser.uid) {
        console.error('Current user or edited site is undefined');
        return;
      }

      if (!editedSiteName.trim() || !editedImageUrl.trim() || !editedUrl.trim()) {
        console.error('All fields are required');
        setEditError(true); // Show edit error message
        return;
      }

      // Update site data in Firestore
      const siteDocRef = doc(firestore, 'users', currentUser.uid, 'sites', editedSite.id);
      await updateDoc(siteDocRef, {
        siteName: editedSiteName,
        imageUrl: editedImageUrl,
        url: editedUrl,
      });

      // If there's a new image file, upload it to Firebase Storage
      if (editedImageFile) {
        // Delete existing image from Firebase Storage
        const imageRef = ref(storage, editedSite.imageUrl);
        await deleteObject(imageRef);

        // Upload new image
        const newStorageRef = ref(storage, `images/${currentUser.uid}/${editedImageFile.name}`);
        const uploadTask = uploadBytesResumable(newStorageRef, editedImageFile);
        await uploadTask;
        
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(newStorageRef);

        // Update the imageUrl in Firestore
        await updateDoc(siteDocRef, {
          imageUrl: downloadURL,
        });
      }

      // Clear edit state
      setEditedSite(null);
      setEditedSiteName('');
      setEditedImageUrl('');
      setEditedImageFile(null);
      setEditedUrl('');
      
      // Close edit modal
      setShowEditModal(false);
      
      // Fetch updated sites
      fetchSites(currentUser.uid);
    } catch (error) {
      console.error('Error editing site:', error);
    }
  };

  const openEditModal = (site) => {
    setEditedSite(site);
    setEditedSiteName(site.siteName);
    setEditedImageUrl(site.imageUrl);
    setEditedUrl(site.url);
    setShowEditModal(true);
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
      console.log("Image URL:", imageUrl);
  
      // Ensure that imageUrl is not empty
      if (!imageUrl) {
        console.error('Image URL is empty');
        return;
      }
  
      // reference to the image file in Firebase Storage
      const imageRef = ref(storage, imageUrl);
  
      // Delete the image file from Firebase Storage
      await deleteObject(imageRef);
  
      // reference to the document representing the site in Firestore
      const siteDocRef = doc(firestore, 'users', currentUser.uid, 'sites', siteId);
  
      // Delete the document representing the site from Firestore
      await deleteDoc(siteDocRef);
  
      // Update the state to remove the deleted site
      setSites(prevSites => prevSites.filter(site => site.id !== siteId));
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
        <div className='text-center'>
          <h1 className="text-2xl font-bold mb-4">Sites</h1>
          <p className='mb-4'>Save your favorite site that has sales here. </p>
          <p className='mb-4'> Click Add a new site to add the site name, photo of your choosing and the url of the sales page of your favorite site.</p>
          <p className='mb-8'>Then click on your uploaded url to view and save on your favorite site!</p>
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8">Add a new site</button>
        </div>
        <div className="w-full max-w-md">
          {sites.map((site, index) => (
            <Site 
              key={index} 
              index={index}
              site={site} 
              handleRemoveSite={handleRemoveSite}
              showDropdowns={showDropdowns[index]} 
              toggleDropdown={() => toggleDropdown(index)}
              openEditModal={openEditModal}
            />
          ))}
        </div>
      </div>
      {showModal && (
        <AddNewSiteForm
          siteName={siteName}
          handleSiteNameChange={(e) => setSiteName(e.target.value)}
          imageUrl={imageUrl}
          imageFile={imageFile}
          handleImageUpload={(e) => handleImageUpload(e)}
          handleRemoveImage={() => handleRemoveImage()}
          url={url}
          handleUrlChange={(e) => setUrl(e.target.value)}
          showError={showError}
          setShowError={setShowError}
          handleAddSite={handleAddSite}
          setShowModal={setShowModal}
        />
      )}
      {showEditModal && (
        <EditSiteForm
          site={editedSite}
          userId={currentUser.uid} 
          editedSiteName={editedSiteName}
          setEditedSiteName={setEditedSiteName}
          editedImageUrl={editedImageUrl}
          setEditedImageUrl={setEditedImageUrl}
          editedUrl={editedUrl}
          setEditedUrl={setEditedUrl}
          editedImageFile={editedImageFile}
          setEditedImageFile={setEditedImageFile}
          showError={editError}
          handleEditSite={handleEditSite}
          setShowModal={setShowEditModal}
          setShowError={setEditError}
        />
      )}
    </div>
  );
};

export default ProtectedRoute(Sites);
