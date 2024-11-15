"use client";

import React, {useState, useEffect, useRef} from 'react';
import {GoogleMap, Marker, useJsApiLoader, Libraries} from '@react-google-maps/api';
import {defaultCenter, googleMapsApiKey, places} from '../config';
import {database, ref, set, onValue} from '../firebase/firebase-config';
import {useUserLocation} from './useUserLocation';
import {addMarker, recenterMap} from './MapUtils';
// import {InputText} from 'primereact/inputtext';
import {getAllDocuments} from '../firestore/getData';
import {collection, getFirestore, onSnapshot} from "firebase/firestore";
import firebase_app from "../firebase/firebase-config";

const containerStyle = {
    width: '600px',
    height: '600px',
    cursor: 'pointer',
};

// Define the type for props
interface MapComponentProps {
    user: string; // user is now a string (e.g., username)
}

const MapComponent: React.FC<MapComponentProps> = ({user}) => {

    const mapRef = useRef<google.maps.Map | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    var infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [markers, setMarkers] = useState<{
        lat: number; lng: number
    }[]>(places);
    const [searchPlacesMarkers, setSearchPlacesMarkers] = useState<{
        lat: number;
        lng: number;
        marker: google.maps.Marker
    }[]>([]); // Store marker objects here
    const {userLocation, setUserLocation} = useUserLocation();
    const libraries: Libraries = ['places'];

    const [valueSearch, setValueSearch] = useState('');

    const {isLoaded, loadError} = useJsApiLoader({
        googleMapsApiKey,
        libraries,
    });

    const db = getFirestore(firebase_app);

    // Fetch markers from Firebase
    useEffect(() => {
        const markersRef = ref(database, 'markers');
    }, []);

    // Initialize Places Service once the map and libraries are fully loaded
    useEffect(() => {
        if (isLoaded && mapRef.current) {
            console.log('Map loaded:', mapRef.current);
            placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);
        }
    }, [isLoaded]);

    useEffect(() => {
        const markersCollectionRef = collection(db, "markers");

        // Set up the real-time listener for the collection
        const unsubscribe = onSnapshot(markersCollectionRef, (snapshot) => {
            const fetchedMarkers: any[] = []; // Initialize an array to store documents

            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedMarkers.push({
                    lat: data.lat,
                    lng: data.lng,
                });
            });

            // Update state with the fetched markers
            setMarkers(fetchedMarkers);

            console.log('Fetched markers:', fetchedMarkers);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
    }, []);

    // Handle map click to add marker
    const handleMapClick = (event: google.maps.MapMouseEvent) => {

        console.log("Map clicked at: ", event.latLng);

        if (user === "user") {
            console.log("You are not just a user");
            return;
        }

        const latLng = event.latLng;
        if (latLng) {
            const lat = latLng.lat();
            const lng = latLng.lng();
            addMarker(lat, lng);

            setMarkers((prevMarkers) => [...prevMarkers, {lat, lng}]);
        }
    };

    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    // Initialize PlacesService on map load
    const onMapLoad = (map: google.maps.Map) => {

        console.log('Map loaded:', map);

        mapRef.current = map;
        if (window.google && window.google.maps && !placesServiceRef.current) {
            placesServiceRef.current = new google.maps.places.PlacesService(map);
            console.log('PlacesService initialized:', placesServiceRef.current);
        }
    }

    const createMarker = (place: google.maps.places.PlaceResult) => {
        if (!place.geometry || !place.geometry.location) return;

        const marker = new google.maps.Marker({
            map: mapRef.current,
            position: place.geometry.location,
        });

        google.maps.event.addListener(marker, 'click', () => {

            console.log('Marker clicked:', place);
            console.log('InfoWindow:', infoWindowRef.current);

            if (!infoWindowRef.current) {
                infoWindowRef.current = new google.maps.InfoWindow();
            }

            if (infoWindowRef.current) {

                var content = (place.name ? place.name : '') + '<br>' +
                    (place.vicinity ? place.vicinity : '') + '<br>' +
                    (place.rating ? 'Rating: ' + place.rating : '') + '<br>' +
                    (place.user_ratings_total ? 'Total ratings: ' + place.user_ratings_total : '');

                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(mapRef.current, marker);
            }

        });

        if (place.geometry && place.geometry.location) {

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setSearchPlacesMarkers((prevMarkers) => [...prevMarkers, {
                lat,
                lng,
                marker
            }]);
        }

    };

    // Function to delete a marker
    const deleteMarker = (markerToDelete: google.maps.Marker) => {
        // Remove the marker from the map
        markerToDelete.setMap(null);

        // Remove the marker from the state array
        setSearchPlacesMarkers((prevMarkers) =>
            prevMarkers.filter((marker) => marker.marker !== markerToDelete)
        );
    };

    // Function to search for places by category near user location
    const searchPlacesByCategory = (category: string) => {

        searchPlacesMarkers.forEach((place) => {
            deleteMarker(place.marker)
        }); // Remove previous search results

        console.log('Searching for places:', category);

        console.log('PlacesService:', placesServiceRef.current, 'User location:', userLocation);

        if (placesServiceRef.current && userLocation && category) {
            const request = {
                location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                radius: 5000, // Search within 5 km
                type: category, // Use category type, e.g., "restaurant"
            };

            placesServiceRef.current.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    setSearchResults(results);
                    console.log('Search results:', results);
                    results.forEach((place) => createMarker(place));
                } else {
                    console.log('Place search failed:', status);
                }
            });
        }
    };

    const searchPlacesByAddress = (address: string) => {
        const request = {
            query: address,
            fields: ["name", "geometry"],
        };

        placesServiceRef.current?.findPlaceFromQuery(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    console.log('Search results:', results);
                    results.forEach((place) => createMarker(place));

                    recenterMap(mapRef, results[0].geometry?.location);
                } else {
                    console.log('Place search failed:', status);
                }
            }
        );
    }

    return (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || defaultCenter}
                zoom={10}
                onClick={handleMapClick} // Add marker on map click
                onLoad={onMapLoad}
            >

                {/* Render markers from Firebase */}
                {markers.map((marker, index) => (
                    <Marker key={index} position={{lat: marker.lat, lng: marker.lng}}/>
                ))}

                {/* Render a marker for the user's current location */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                        title="You are here"
                    />
                )}

                {/* Render search result markers */}
                {/* {searchResults.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            }}
            title={place.name}
          />
        ))} */}


            </GoogleMap>

            {/* Dropdown for place categories */}
            <select onChange={(e) => searchPlacesByCategory(e.target.value)}>
                <option value="">Select a category</option>
                <option value="restaurant">Restaurants</option>
                <option value="gym">Gyms</option>
                <option value="hospital">Hospitals</option>
                <option value="school">Schools</option>
                <option value="subway station">Subways</option>
                <option value="park">Parks</option>
            </select>

            {/* Button to recenter the map */}
            <button
                className="mt-4 p-2 bg-blue-500 text-white rounded"
                onClick={() => recenterMap(mapRef, userLocation)} style={{marginTop: '10px'}}
            >
                Recenter to Current Location
            </button>

            <div>
                <h3>Enter Text</h3>
                <InputText
                    value={valueSearch}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setValueSearch(e.target.value);
                        searchPlacesByAddress(e.target.value);
                        console.log("Logged in as " + user);
                    }}
                    placeholder="Type something..."
                />
            </div>
        </div>
    );
};

export default MapComponent;
