// file location: frontend/src/components/Venue/VenueList.jsx
import React from "react";

const VenueList = ({ venues, onDelete }) => {
    return (
        <ul className="divide-y divide-gray-200 bg-white shadow rounded">
            {venues.map((venue) => (
                <li key={venue.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="font-semibold text-sm">{venue.name}</div>
                    <div className="text-gray-600 text-xs">{venue.address}</div>

                    {/* Delete */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this venue?')) {
                                onDelete(venue.id);
                            }
                        }}
                        className="text-red-600 hover:text-red-900 text-xs font-medium">
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default VenueList;