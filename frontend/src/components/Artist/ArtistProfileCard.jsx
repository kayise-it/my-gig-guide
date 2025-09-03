//frontend/src/components/Artist/ArtistProfileCard.jsx
import { UserIcon, MusicalNoteIcon, PencilIcon } from '@heroicons/react/24/outline';
import ProfilePictureModal from './ProfilePictureModal';

export default function ArtistProfileCard({ 
  artistData, 
  editMode, 
  onEditToggle, 
  isProfileModalOpen, 
  onProfileModalClose,
  onProfileModalOpen,
  onSaveProfilePicture,
  artistSettings,
}) {
  // Build the correct public URL for the profile picture
  let profilePictureUrl = '';
  if (artistData.profile_picture) {
    console.log('🔍 Profile picture data:', artistData.profile_picture);
    
    // Extract the path after "artists/" and construct the correct URL
    let cleanPath = artistData.profile_picture;
    
    // Find the "artists/" part in the path
    const artistsIndex = cleanPath.indexOf('artists/');
    if (artistsIndex !== -1) {
      // Get everything from "artists/" onwards
      cleanPath = cleanPath.substring(artistsIndex);
    } else {
      // If no "artists/" found, use the path as is
      cleanPath = artistData.profile_picture;
    }
    
    // Automatically detect the current domain and properly encode the URL
    const baseUrl = window.location.origin;
    
    // Properly encode the path to handle spaces and special characters
    const encodedPath = encodeURIComponent(cleanPath).replace(/%2F/g, '/');
    profilePictureUrl = `${baseUrl}/${encodedPath}?t=${new Date().getTime()}`;
    
    console.log('🔗 Constructed URL:', profilePictureUrl);
  } else {
    console.log('❌ No profile picture data available');
  }

  return (
    <>
      <div className="bg-white shadow rounded-tl-lg rounded-tr-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  onClick={editMode ? onProfileModalOpen : undefined}
                  className={`h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden ${
                    editMode ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                  }`}
                >
                  {artistData.profile_picture ? (
                    <>
                      {console.log('🖼️ Rendering image with URL:', profilePictureUrl)}
                      <img
                        src={profilePictureUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => console.error('❌ Image failed to load:', e.target.src)}
                        onLoad={() => console.log('✅ Image loaded successfully:', profilePictureUrl)}
                      />
                    </>
                  ) : (
                    <>
                      {console.log('👤 No profile picture, showing default icon')}
                      <div className="h-full w-full bg-indigo-200 flex items-center justify-center">
                        <UserIcon className="h-12 w-12 text-indigo-600" />
                      </div>
                    </>
                  )}
                </div>
                {editMode && (
                  <div
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                    onClick={onProfileModalOpen}
                  >
                    <PencilIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{artistData.stage_name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <MusicalNoteIcon className="h-5 w-5 text-indigo-200" />
                  <span className="text-indigo-100">{artistData.genre}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onEditToggle}
              className="mt-4 md:mt-0 flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-gray-50 transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
              <span>{editMode ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add the modal component here */}
      <ProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={onProfileModalClose}
        initialImage={artistData.profile_picture}
        onSave={onSaveProfilePicture}
        settings={artistSettings}
      />
    </>
  );
}