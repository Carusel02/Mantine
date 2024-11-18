import {onValue} from 'firebase/database';
import addData from '../firestore/addData';
import getData from '../firestore/getData';
import {defaultCenter} from './config';
import {MutableRefObject} from 'react';

// Function to add a new marker to Firebase
export const addMarker = async (lat: number, lng: number) => {

    console.log("Adding marker to Firebase:", {lat, lng});

    const markerId = Date.now().toString();

    // try {
    //   const newMarkerRef = ref(database, `markers/${markerId}`);
    //   await set(newMarkerRef, { lat, lng }); // Add marker to Firebase Realtime Database
    //   console.log(`Marker added to Realtime Database with id ${markerId}:`, { lat, lng });

    // } catch (error) {
    //   console.log("Error adding marker to Realtime Database:", error);
    // }

    try {
        const firestoreResult = await addData("markers", markerId, {lat, lng});
        console.log(`Marker added to Firestore with id ${markerId}:`, {lat, lng});

    } catch (error) {
        console.log("Error adding marker to Firestore:", error);
    }
};

// Function to recentre the map
export const recenterMap = (mapRef: MutableRefObject<google.maps.Map | null>, userLocation: any) => {
    if (mapRef.current && userLocation) {
        mapRef.current.setCenter(userLocation);
        mapRef.current.setZoom(15); // Optional: Adjust zoom level if needed
    } else if (mapRef.current) {
        mapRef.current.setCenter(defaultCenter);
    }
};
