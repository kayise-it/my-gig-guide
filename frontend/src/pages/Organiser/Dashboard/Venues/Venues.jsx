import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { venueService } from '../../../../api/venueService'; // You'll need to implement these API functions
import VenueCard from '../../../../components/Venue/VenueCard'; // Adjust the import path as necessary
import { useAuth } from '../../../../context/AuthContext'; // Adjust the import path as necessary
import DashboardBreadCrumb from '../../../../components/Includes/DashboardBreadCrumb';

export default function Venues() {
    const [venues, setVenues] = useState({});
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const { currentUser } = useAuth();
    const breadcrumbs = [
        { label: 'Dashboard', path: '/organiser/dashboard' },
        { label: 'Venues', path: '/organiser/venues' }
    ];

    useEffect(() => {
    async function fetchVenues() {
        try {
            const response = await venueService.getOrganisersVenues(userId);
            console.log("API response:", response);
            alert("API response: " + JSON.stringify(response));

            if (!response.success) throw new Error("Failed to fetch venues");

            const venueData = response.venue;
            setVenues(venueData); // ✅ FIXED HERE

            console.log("Venue set:", venueData);
        } catch (error) {
            console.error("Error fetching venues:", error.message);
        }
    }
    if (userId) {
        fetchVenues();
    }
}, [userId]);

    return (
        <div>
            <div className='container max-w-5xl mx-auto bg-red-100 px-4 py-6'>
                <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
                <div className="add-venue">
                    <button onClick={() => navigate('/organiser/venues/create')}>A4dd Venue</button>
                </div>
                <h1 className="text-2xl font-bold mb-4">Your Venues</h1>
                {Array.isArray(venues) && venues.length > 0 && (
                    <div className="grid grid-cols-4 venues-list">
                        {venues.map((venue) => (
                            <VenueCard
                                key={venue.id}
                                venue={venue}
                                who={`${currentUser.aclInfo.acl_name}/dashboard`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
