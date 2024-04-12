const Site = ({ site, handleRemoveSite, showDropdowns, toggleDropdown, index, openEditModal }) => {

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow mb-8">
        {/* Your dropdown and site information */}
        <div className="flex justify-end px-4 pt-2">
          <div className="relative">
            <button
              id={`dropdownButton${index}`}
              className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
              type="button"
              onClick={toggleDropdown}
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
                showDropdowns ? "block" : "hidden"
              } z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
            >
              <ul className="py-2" aria-labelledby={`dropdownButton${index}`}>
                <li>
                  <a
                    href="#"
                    onClick={() => openEditModal(site)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Edit
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => handleRemoveSite(site.id, site.imageUrl)}
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
    );
};
  
export default Site;
  

