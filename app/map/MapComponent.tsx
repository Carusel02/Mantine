'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Libraries } from '@react-google-maps/api';
import { defaultCenter, googleMapsApiKey, places } from '../config';
import { database, ref } from '../firebase/firebase-config';
import { useUserLocation } from './useUserLocation';
import { addMarker, recenterMap } from './MapUtils';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import firebase_app from '../firebase/firebase-config';
import {
    Select,
    Button,
    TextInput,
    Box,
    Loader,
    Title,
    Stack,
} from '@mantine/core';

const containerStyle = {
    width: '100%',
    height: '600px',
    cursor: 'pointer',
};

// Define the type for props
interface MapComponentProps {
    user: string; // user is now a string (e.g., username)
}

const MapComponent: React.FC<MapComponentProps> = ({ user }) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>(places);
    const [searchPlacesMarkers, setSearchPlacesMarkers] = useState<{
        lat: number;
        lng: number;
        marker: google.maps.Marker;
    }[]>([]); // Store marker objects here
    const { userLocation } = useUserLocation();
    const libraries: Libraries = ['places'];

    const [valueSearch, setValueSearch] = useState('');
    const [category, setCategory] = useState<string | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey,
        libraries,
    });

    const db = getFirestore(firebase_app);

    // Fetch markers from Firestore
    useEffect(() => {
        const markersCollectionRef = collection(db, 'markers');

        const unsubscribe = onSnapshot(markersCollectionRef, (snapshot) => {
            const fetchedMarkers: any[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedMarkers.push({
                    lat: data.lat,
                    lng: data.lng,
                });
            });

            setMarkers(fetchedMarkers);
            console.log('Fetched markers:', fetchedMarkers);
        });

        return () => unsubscribe();
    }, []);

    // Initialize Places Service once the map and libraries are fully loaded
    useEffect(() => {
        if (isLoaded && mapRef.current) {
            placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);
        }
    }, [isLoaded]);

    // Handle map click to add marker
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (user === 'user') {
            console.log('User does not have permission to add markers.');
            return;
        }

        const latLng = event.latLng;
        if (latLng) {
            const lat = latLng.lat();
            const lng = latLng.lng();
            addMarker(lat, lng);
            setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
        }
    };

    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return (
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                <Loader />
            </Box>
        );
    }

    // Initialize PlacesService on map load
    const onMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        if (window.google && window.google.maps && !placesServiceRef.current) {
            placesServiceRef.current = new google.maps.places.PlacesService(map);
        }
    };

    const createMarker = (place: google.maps.places.PlaceResult) => {
        if (!place.geometry || !place.geometry.location) return;

        const marker = new google.maps.Marker({
            map: mapRef.current,
            position: place.geometry.location,
        });

        google.maps.event.addListener(marker, 'click', () => {
            if (!infoWindowRef.current) {
                infoWindowRef.current = new google.maps.InfoWindow();
            }

            const content = `
        ${place.name || ''}<br>
        ${place.vicinity || ''}<br>
        ${place.rating ? `Rating: ${place.rating}` : ''}<br>
        ${place.user_ratings_total ? `Total ratings: ${place.user_ratings_total}` : ''}
      `;

            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(mapRef.current, marker);
        });

        setSearchPlacesMarkers((prevMarkers) => [
            ...prevMarkers,
            {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                marker,
            },
        ]);
    };

    const searchPlacesByCategory = (category: string) => {
        searchPlacesMarkers.forEach((place) => place.marker.setMap(null)); // Clear previous markers

        if (placesServiceRef.current && userLocation && category) {
            const request = {
                location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                radius: 5000, // 5 km radius
                type: category,
            };

            placesServiceRef.current.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    setSearchResults(results);
                    results.forEach((place) => createMarker(place));
                }
            });
        }
    };

    const searchPlacesByAddress = (address: string) => {
        const request = {
            query: address,
            fields: ['name', 'geometry'],
        };

        placesServiceRef.current?.findPlaceFromQuery(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                results.forEach((place) => createMarker(place));
                recenterMap(mapRef, results[0].geometry?.location);
            }
        });
    };

    return (
        <Box>
            <Title order={3}>Interactive Map</Title>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || defaultCenter}
                zoom={10}
                onClick={handleMapClick}
                onLoad={onMapLoad}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
                ))}

                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        }}
                        title="You are here"
                    />
                )}
            </GoogleMap>

            <Stack spacing="sm" mt="md">
                <Select
                    label="Search Places by Category"
                    placeholder="Select a category"
                    data={[
                        { value: 'restaurant', label: 'Restaurants' },
                        { value: 'gym', label: 'Gyms' },
                        { value: 'hospital', label: 'Hospitals' },
                        { value: 'school', label: 'Schools' },
                        { value: 'subway_station', label: 'Subway Stations' },
                        { value: 'park', label: 'Parks' },
                    ]}
                    value={category}
                    onChange={(value) => {
                        setCategory(value);
                        searchPlacesByCategory(value || '');
                    }}
                />

                <TextInput
                    label="Search by Address"
                    placeholder="Type an address..."
                    value={valueSearch}
                    onChange={(e) => {
                        const address = e.target.value;
                        setValueSearch(address);
                        searchPlacesByAddress(address);
                    }}
                />

                <Button onClick={() => recenterMap(mapRef, userLocation)} variant="outline">
                    Recenter to Current Location
                </Button>
            </Stack>
        </Box>
    );
};

export default MapComponent;
