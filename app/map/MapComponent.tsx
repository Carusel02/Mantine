'use client';

import React, {useRef, useState} from 'react';
import {Libraries, useJsApiLoader} from '@react-google-maps/api';
import {googleMapsApiKey} from './config';
import {useUserLocation} from './useUserLocation';
import {createMarker, createMarkerAddressSearch, recenterMap} from './MapUtils';
import RecenterButton from './RecenterButton';
import GoogleMapComponent from './GoogleMapComponent';
import AddressSearch from './AddressSearch';
import PlaceCategorySelect from './PlaceCategorySelect';
import {handleMapClick, handleMapDblClick} from './MapEventHandlers';
import {useBermudaTriangle, useFetchMarkers, usePlacesService} from './useEffectsMap';
import {AspectRatio, Box, Flex, Group, Loader, Title,} from '@mantine/core';
import categoryIcons from './categoryIcons';

import { useMapContext } from '../map/MapContext';

interface MapComponentProps {
    user: string;
}

const libraries: Libraries = ['places'];

const MapComponent: React.FC<MapComponentProps> = ({user}) => {

    const { mapRef, placesServiceRef, isLoaded } = useMapContext();
    // const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchAddressResult, setSearchAddressResult] = useState<google.maps.places.PlaceResult[]>([]);
    const [valueSearch, setValueSearch] = useState('');
    const [category, setCategory] = useState<string | null>(null);

    // const {isLoaded, loadError} = useJsApiLoader({
    //     googleMapsApiKey,
    //     libraries,
    // });

    const {markers, setMarkers} = useFetchMarkers();
    const {userLocation} = useUserLocation();
    // const placesServiceRef = usePlacesService(isLoaded, mapRef);

    const [bermudaTriangle, setBermudaTriangle] = useState<google.maps.Polygon | null>(null);
    useBermudaTriangle(bermudaTriangle, user, mapRef);

    const [searchCategoryMarkers, setSearchCategoryMarkers] = useState<{
        lat: number;
        lng: number;
        marker: google.maps.Marker;
    }[]>([]); // Store marker objects here

    const [searchAddressMarker, setSearchAddressMarker] = useState<{
        lat: number;
        lng: number;
        marker: google.maps.Marker;
    }[]>([]); // Store marker objects here


    // if (loadError) {
    //     return <div>Error loading Google Maps</div>;
    // }

    if (!isLoaded) {
        return (
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px'}}>
                <Loader/>
            </Box>
        );
    }

    const searchPlacesByCategory = (category: string) => {
        searchCategoryMarkers.forEach((place) => place.marker.setMap(null)); // Clear previous markers

        if (placesServiceRef.current && userLocation && category) {
            const request = {
                location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                radius: 10000, // 10 km radius
                type: category,
            };

            placesServiceRef.current.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    setSearchResults(results);
                    if (mapRef.current) {
                        results.forEach((place) => createMarker(place, mapRef.current, setSearchCategoryMarkers, infoWindowRef, categoryIcons[category]));
                    }
                }
            });
        }
    };

    const handleSearchResults = (results: google.maps.places.PlaceResult[]) => {
        // console.log('Current markers:', searchAddressMarker);

        // searchAddressMarker.forEach((place) => {
        //     place.marker.setMap(null);
        //     console.log('Removing marker:', place.marker);
        // }); // Clear previous markers

        // console.log('New results:', results);

        // if (results.length > 0) {
        //     setSearchAddressResult(results);
        // } else {
        //     setSearchAddressResult(null);  // No results found
        // }

        // if (mapRef.current && results.length > 0) {
        //     results.forEach((place) => {
        //         createMarker(place, mapRef.current, setSearchAddressMarker, infoWindowRef);
        //         recenterMap(mapRef, place.geometry?.location);
        //     });
        // }

        // console.log('New markers:', searchAddressMarker);


        searchAddressMarker.forEach((place) => place.marker.setMap(null)); // Clear all existing markers
        setSearchAddressMarker([]); // Reset state
        console.log('MARKER:', searchAddressMarker);
    
        if (results.length > 0) {
            const place = results[0]; // Get the top result
            console.log('TOP RESULT:', place);
            setSearchAddressResult(results);
    
            if (mapRef.current) {
                createMarker(place, mapRef.current, setSearchAddressMarker, infoWindowRef);
                recenterMap(mapRef, place.geometry?.location);
            }
        }

    };


    const triangleCoords = [
        {lat: 44.37703333630288, lng: 26.1201399190022},
        {lat: 44.37997795420136, lng: 26.134688220698976},
        {lat: 44.393748211491236, lng: 26.120998225886964},
    ];

    const onMapLoad = (map: google.maps.Map) => {
        console.log("User: ", user);
        mapRef.current = map;
        if (window.google && window.google.maps && !placesServiceRef.current) {
            placesServiceRef.current = new google.maps.places.PlacesService(map);
        }
        if (user === 'buyer') {
            setBermudaTriangle(new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.1,
                clickable: true,
            }));
        }
    };

    return (

        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap" px="md">
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
                    onMapLoad={onMapLoad}
                />
            </AspectRatio>

            <Group align="center" justify="center" mt="md">
                <RecenterButton onClick={() => recenterMap(mapRef, userLocation)}/>
            </Group>

        </Flex>
    );

};

export default MapComponent;
