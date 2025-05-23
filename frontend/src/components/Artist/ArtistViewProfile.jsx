import { 
  UserIcon, 
  MusicalNoteIcon, 
  PhoneIcon, 
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function ArtistViewProfile({ artistData }) {
  return (
    <div className="bg-white shadow rounded-bl-lg rounded-br-lg px-6 py-5 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-gray-50 px-4 py-5 rounded-lg">
          <dt className="flex items-center space-x-2 text-sm font-medium text-gray-500">
            <UserIcon className="h-5 w-5 text-indigo-500" />
            <span>Real Name</span>
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{artistData.real_name}</dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 rounded-lg">
          <dt className="flex items-center space-x-2 text-sm font-medium text-gray-500">
            <MusicalNoteIcon className="h-5 w-5 text-indigo-500" />
            <span>Genre</span>
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{artistData.genre}</dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 rounded-lg">
          <dt className="flex items-center space-x-2 text-sm font-medium text-gray-500">
            <PhoneIcon className="h-5 w-5 text-indigo-500" />
            <span>Phone Number</span>
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{artistData.phone_number}</dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 rounded-lg">
          <dt className="flex items-center space-x-2 text-sm font-medium text-gray-500">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            <span>Member Since</span>
          </dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </dd>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-5 rounded-lg">
        <dt className="text-sm font-medium text-gray-500">Bio</dt>
        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
          {artistData.bio}
        </dd>
      </div>

      {(artistData.instagram || artistData.facebook || artistData.twitter) && (
        <div className="bg-gray-50 px-4 py-5 rounded-lg">
          <dt className="text-sm font-medium text-gray-500 mb-3">Social Media</dt>
          <dd className="flex flex-wrap gap-4">
            {artistData.instagram && (
              <a
                href={`https://instagram.com/${artistData.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Instagram: @{artistData.instagram}
              </a>
            )}
            {artistData.twitter && (
              <a
                href={`https://twitter.com/${artistData.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Twitter: @{artistData.twitter}
              </a>
            )}
            {artistData.facebook && (
              <a
                href={`https://facebook.com/${artistData.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Facebook: {artistData.facebook}
              </a>
            )}
          </dd>
        </div>
      )}
    </div>
  );
}