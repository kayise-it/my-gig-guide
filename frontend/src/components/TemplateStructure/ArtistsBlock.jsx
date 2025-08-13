import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, MapPinIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ArtistsBlock = ({ eventArtist = null }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use event artist if provided, otherwise use dummy data
    const featuredArtists = eventArtist ? [
        {
            id: eventArtist.id,
            name: eventArtist.real_name || eventArtist.stage_name,
            stageName: eventArtist.stage_name,
            genre: "Featured Artist", // You can add genre to the artist data if needed
            location: "Johannesburg", // You can add location to the artist data if needed
            rating: 4.8,
            image: null,
            followers: "12.5K",
            upcomingEvents: 3
        }
    ] : [
        {
            id: 1,
            name: "Thando Maseko",
            stageName: "Thando",
            genre: "Afro Pop",
            location: "Johannesburg",
            rating: 4.8,
            image: null,
            followers: "12.5K",
            upcomingEvents: 3
        },
        {
            id: 2,
            name: "Lerato Nkosi",
            stageName: "Lera",
            genre: "Hip Hop",
            location: "Cape Town",
            rating: 4.6,
            image: null,
            followers: "8.9K",
            upcomingEvents: 2
        },
        {
            id: 3,
            name: "Sipho Dlamini",
            stageName: "Sipho",
            genre: "Jazz",
            location: "Durban",
            rating: 4.9,
            image: null,
            followers: "15.2K",
            upcomingEvents: 5
        },
        {
            id: 4,
            name: "Nokuthula Zulu",
            stageName: "Nokz",
            genre: "R&B",
            location: "Pretoria",
            rating: 4.7,
            image: null,
            followers: "10.1K",
            upcomingEvents: 1
        },
        {
            id: 5,
            name: "David Mokoena",
            stageName: "Dave",
            genre: "Electronic",
            location: "Bloemfontein",
            rating: 4.5,
            image: null,
            followers: "6.8K",
            upcomingEvents: 4
        },
        {
            id: 6,
            name: "Amanda Smith",
            stageName: "Mandy",
            genre: "Soul",
            location: "Port Elizabeth",
            rating: 4.4,
            image: null,
            followers: "9.3K",
            upcomingEvents: 2
        },
        {
            id: 7,
            name: "Michael Johnson",
            stageName: "Mike J",
            genre: "Rock",
            location: "East London",
            rating: 4.3,
            image: null,
            followers: "7.6K",
            upcomingEvents: 3
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === Math.ceil(featuredArtists.length / 3) - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? Math.ceil(featuredArtists.length / 3) - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const totalSlides = Math.ceil(featuredArtists.length / 3);

    return (
        <div className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Featured{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Artists
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover amazing local talent and upcoming performers in your area
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-purple-200 hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        disabled={totalSlides <= 1}
                    >
                        <ChevronLeftIcon className="h-6 w-6 text-purple-600" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-purple-200 hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        disabled={totalSlides <= 1}
                    >
                        <ChevronRightIcon className="h-6 w-6 text-purple-600" />
                    </button>

                    {/* Artists Grid */}
                    <div className="overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredArtists.slice(slideIndex * 3, (slideIndex + 1) * 3).map((artist) => (
                                        <div key={artist.id} className="group">
                                            <div className="bg-white border border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                                                {/* Artist Image */}
                                                <div className="relative mb-4">
                                                    <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                                        {artist.image ? (
                                                            <img
                                                                src={artist.image}
                                                                alt={artist.stageName}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                                                                <div className="text-center text-white">
                                                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                        <MusicalNoteIcon className="h-8 w-8" />
                                                                    </div>
                                                                    <p className="text-sm font-medium">{artist.stageName}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Rating Badge */}
                                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                                                        <div className="flex items-center">
                                                            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                                                            <span className="text-sm font-semibold text-gray-900 ml-1">
                                                                {artist.rating}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Genre Badge */}
                                                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                                                        {artist.genre}
                                                    </div>
                                                </div>

                                                {/* Artist Info */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                                            {artist.stageName}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">{artist.name}</p>
                                                    </div>

                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <MapPinIcon className="h-4 w-4 mr-2 text-purple-500" />
                                                        <span>{artist.location}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center text-gray-600">
                                                            <MusicalNoteIcon className="h-4 w-4 mr-2 text-purple-500" />
                                                            <span>{artist.upcomingEvents} events</span>
                                                        </div>
                                                        <span className="text-purple-600 font-semibold">
                                                            {artist.followers} followers
                                                        </span>
                                                    </div>

                                                    {/* Action Button */}
                                                    <Link
                                                        to={`/artists/${artist.id}`}
                                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center group-hover:scale-105 shadow-md"
                                                    >
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel Indicators */}
                    {totalSlides > 1 && (
                        <div className="flex justify-center space-x-2 mt-8">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-125'
                                            : 'bg-gray-300 hover:bg-purple-300'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Slide Counter */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                        <span className="text-sm font-medium text-purple-700">
                            {currentIndex + 1} of {totalSlides}
                        </span>
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/artists"
                        className="inline-flex items-center bg-white border border-purple-200 hover:border-purple-300 text-purple-700 font-medium py-3 px-8 rounded-xl transition-all duration-300 hover:bg-purple-50 shadow-md hover:shadow-lg"
                    >
                        <span>View All Artists</span>
                        <ChevronRightIcon className="h-5 w-5 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArtistsBlock;
