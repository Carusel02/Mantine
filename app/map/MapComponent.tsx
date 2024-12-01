'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Libraries, useJsApiLoader} from '@react-google-maps/api';
import {googleMapsApiKey, places} from './config';
import {useUserLocation} from './useUserLocation';
import {createMarker, recenterMap} from './MapUtils';
import {collection, getFirestore, onSnapshot} from 'firebase/firestore';
import RecenterButton from './RecenterButton';
import GoogleMapComponent from './GoogleMapComponent';
import AddressSearch from './AddressSearch';
import PlaceCategorySelect from './PlaceCategorySelect';
import {handleMapClick, handleMapDblClick, onMapLoad} from './MapEventHandlers';
import firebase_app from '../firebase/firebase-config';
import {AspectRatio, Box, Flex, Group, Loader, Title,} from '@mantine/core';

// Define the type for props
interface MapComponentProps {
    user: string; // user is now a string (e.g., username)
}

const MapComponent: React.FC<MapComponentProps> = ({user}) => {
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
    const {userLocation} = useUserLocation();
    const libraries: Libraries = ['places'];

    const [valueSearch, setValueSearch] = useState('');
    const [category, setCategory] = useState<string | null>(null);

    const {isLoaded, loadError} = useJsApiLoader({
        googleMapsApiKey,
        libraries,
    });

    const db = getFirestore(firebase_app);

    const [bermudaTriangle, setBermudaTriangle] = useState<google.maps.Polygon | null>(null);

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
    }, [db]);

    // Initialize Places Service once the map and libraries are fully loaded
    useEffect(() => {
        if (isLoaded && mapRef.current) {
            placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);
        }
    }, [isLoaded]);

    useEffect(() => {
        if (bermudaTriangle && user === 'buyer') {
            bermudaTriangle.setMap(mapRef.current);
        } else {
            console.log("No bermudaTriangle found");
        }
    }, [bermudaTriangle, user]);

    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return (
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px'}}>
                <Loader/>
            </Box>
        );
    }
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
                    if (mapRef.current) {
                        results.forEach((place) => createMarker(place, mapRef.current, setSearchPlacesMarkers, infoWindowRef));
                    }
                }
            });
        }
    };

    const handleSearchResults = (results: google.maps.places.PlaceResult[]) => {
        setSearchResults(results);
        if (mapRef.current) {
            results.forEach((place) => createMarker(place, mapRef.current, setSearchPlacesMarkers, infoWindowRef));
        }
        recenterMap(mapRef, results[0].geometry?.location);
    }

    const onMapLoadHandler = (map: google.maps.Map) => {
        onMapLoad(map, user, setBermudaTriangle, placesServiceRef);
    };

    return (
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            px="md"
        >
            <Title order={3} mt="lg" mb="md">
                Explore Nearby Places
            </Title>

            <Box maw="800px" w="100%">
                <Group gap="lg" grow>
                    <PlaceCategorySelect
                        category={category}
                        setCategory={setCategory}
                        searchPlacesByCategory={searchPlacesByCategory}
                    />

                    <AddressSearch
                        value={valueSearch}
                        onChange={(e) => setValueSearch(e.target.value)}
                        placesServiceRef={placesServiceRef}
                        onSearchResults={handleSearchResults}
                    />
                </Group>
            </Box>

            <AspectRatio ratio={16 / 9} w="100%" maw="800px" mt="lg">
                <GoogleMapComponent
                    markers={markers}
                    userLocation={userLocation}
                    onMapClick={(e) => handleMapClick(e, user, setMarkers)}
                    onMapDblClick={(e) => handleMapDblClick(e, user, bermudaTriangle, mapRef)}
                    onMapLoad={onMapLoadHandler}
                />
            </AspectRatio>

            <Group align="center" justify="center" mt="md">
                <RecenterButton onClick={() => recenterMap(mapRef, userLocation)}/>
            </Group>

        </Flex>
    );

};

export default MapComponent;
