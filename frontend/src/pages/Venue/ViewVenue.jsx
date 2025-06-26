import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { venueService } from '../../api/venueService'; // You'll need to implement these API functions
import VenueCard from '../../components/Venue/VenueCard'; // Adjust the import path as necessary
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary'
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import { Link } from 'react-router-dom';
import GoogleMapComponent from '../../components/Map/GoogleMapComponent';


export default function ViewVenue() {
  const { id } = useParams(); // 👈 Get the venue ID from the URL
  const [venue, setVenue] = useState(null);
  const [venues, setVenues] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await venueService.getVenueById(id);
        console.log("Venue qwe:", response);
        setVenue(response.venue);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    }
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const fetchVenues = async () => {
      /* Try to get the vunues for this currentUser.id */
      try {
        const response = await venueService.getOrganisersVenues(userId);
        setVenues(response);

      } catch (error) {
        console.error("Failed to fetch venues:", error);
        setApiError("Failed to fetch venues.");
      }
    };

    if (id) { fetchVenue(); fetchVenues(); }
  }, [id]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/organiser/dashboard' },
    { label: venue?.name, path: `/organiser/dashboard/venues/edit/${id}` },
  ];

  console.log(venue)

  if (!venue) return <div>Loading...</div>;
  return (
    <div className="">
      <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
      <div className="max-w-7xl mx-auto p-3 space-y-3 sm:space-y-0 sm:px-6 lg:px-8">
        {/* The Map */}
        <div className="w-full h-64 rounded-lg overflow-hidden mb-4">

          <GoogleMapComponent
            gigs={[
              {
                id: venue.id,
                name: venue.name,
                venue: {
                  name: venue.name,
                  address: venue.address
                }
              }
            ]}
            apiKey={'AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y'}
          />
        </div>
        <div className="grid space-y-6 md:grid-cols-6 gap-4 max-w-4xl mx-auto border p-6 rounded-lg shadow-md bg-white">
          <div className="md:col-span-4 grid grid-cols-1">
            <div className="">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold mb-4">{venue.name}</h1>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> {venue.location}</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> {venue.address}</p>
                <p className="text-gray-700 mb-2"><strong>Capacity:</strong> {venue.capacity}</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> {venue.phone_number}</p>
                <p className="text-gray-700 mb-2"><strong>Email:</strong> {venue.contact_email}</p>
                <p className="text-gray-700 mb-4"><strong>Website:</strong>{" "} <a href={venue.website} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" >{venue.website}</a></p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white p-3 rounded-lg">
              <div className="bg-white overflow-hidden sm:rounded-lg mb-8">
                <div className="sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold mb-2">Other Venues</h2>
                </div>
                <div className="divide-y divide-gray-200 mt-4">
                  {/* If the events */}
                  {error && <div className="text-center py-8 text-red-500">{error} <Link to="/organiser/dashboard/events/new">Create Event</Link></div>}
                  {venues && venues.length > 0 ? (
                    <div className="space-y-4 sm:px-6 flex justify-between items-center">

                      <ul className="space-y-2">
                        {venues.map((venue) => (
                          <li className="m-0 p-0">
                            <Link to={`/organiser/dashboard/venues/${venue.id}`} className="text-blue-500 hover:underline" >
                              {venue.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                  ) : (
                    <p className="text-gray-500">No other venues available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}