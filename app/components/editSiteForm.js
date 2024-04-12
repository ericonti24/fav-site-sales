import React from 'react';

const EditSiteForm = ({
  site,
  userId,
  editedSiteName,
  setEditedSiteName,
  editedImageUrl,
  setEditedImageUrl,
  editedUrl,
  setEditedUrl,
  editedImageFile,
  setEditedImageFile,
  showError,
  handleEditSite,
  setShowModal,
  setShowError
}) => {
  // Show values based on the selected site data
  React.useEffect(() => {
    if (site) {
      setEditedSiteName(site.siteName);
      setEditedImageUrl(site.imageUrl);
      setEditedUrl(site.url);
    }
  }, [site]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-black">Edit Site</h2>
        <div className="mb-4">
          <label htmlFor="siteName" className="block font-semibold mb-2 text-black">Site Name:</label>
          <input type="text" id="siteName" value={editedSiteName} onChange={(e) => setEditedSiteName(e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
          {showError && !editedSiteName && <p className="text-red-500 mt-1">Site Name is required</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block font-semibold mb-2 text-black">Add Photo:</label>
          <input type="file" id="image" onChange={(e) => setEditedImageFile(e.target.files[0])} />
          {editedImageUrl && (
            <div className="flex items-center mt-2">
              {editedImageFile && editedImageFile.name &&
                <p className="text-gray-500 mr-2">{editedImageFile.name}</p>
              }
              <button onClick={() => setEditedImageFile(null)} className="bg-red-600 text-black px-1 py-1 rounded hover:bg-red-700">Remove</button>
            </div>
          )}
          {showError && !editedImageFile && <p className="text-red-500 mt-1">Image is required</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="url" className="block font-semibold mb-2 text-black">URL Link:</label>
          <input type="text" id="url" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} className="w-full border rounded px-3 py-2 text-black" />
          {showError && !editedUrl && <p className="text-red-500 mt-1">URL Link is required</p>}
        </div>
        <div className="flex justify-end">
          <button onClick={() => { setShowError(true); handleEditSite(userId); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
          <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-4 hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditSiteForm;

