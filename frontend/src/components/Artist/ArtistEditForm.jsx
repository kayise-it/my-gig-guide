import {
  UserIcon,
  MusicalNoteIcon,
  PhoneIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function ArtistEditForm({
  artistData,
  onInputChange,
  onSubmit,
  onCancel
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white shadow rounded-bl-lg rounded-br-lg px-6 py-5 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="stage_name" className="block text-sm font-medium text-gray-700">
            Stage Name
          </label>
          <input
            type="text"
            name="stage_name"
            id="stage_name"
            value={artistData.stage_name}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="real_name" className="block text-sm font-medium text-gray-700">
            Real Name
          </label>
          <input
            type="text"
            name="real_name"
            id="real_name"
            value={artistData.real_name || ""}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <input
            type="text"
            name="genre"
            id="genre"
            value={artistData.genre}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone_number"
              id="phone_number"
              value={artistData.phone_number}
              onChange={onInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3"
              placeholder="+27 12 345 6789"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            rows={4}
            value={artistData.bio}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
            Instagram
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">@</span>
            </div>
            <input
              type="text"
              name="instagram"
              id="instagram"
              value={artistData.instagram}
              onChange={onInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md py-2 px-3"
              placeholder="username"
            />
          </div>
        </div>

        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
            Twitter
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">@</span>
            </div>
            <input
              type="text"
              name="twitter"
              id="twitter"
              value={artistData.twitter}
              onChange={onInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md py-2 px-3"
              placeholder="username"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
            Facebook
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">facebook.com/</span>
            </div>
            <input
              type="text"
              name="facebook"
              id="facebook"
              value={artistData.facebook}
              onChange={onInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-28 sm:text-sm border-gray-300 rounded-md py-2 px-3"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}