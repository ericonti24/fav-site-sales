import React from 'react';

const AddNewSiteForm = ({ siteName, handleSiteNameChange, imageUrl, imageFile, handleImageUpload, handleRemoveImage, url, handleUrlChange, showError, handleAddSite, setShowModal, setShowError }) => {
  return (
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
  );
}

export default AddNewSiteForm;
