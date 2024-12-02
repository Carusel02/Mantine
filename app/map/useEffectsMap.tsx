import { useEffect, useRef, useState } from 'react';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import firebase_app from '../firebase/firebase-config';

export const useFetchMarkers = () => {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
    const db = getFirestore(firebase_app);

    useEffect(() => {
        const markersCollectionRef = collection(db, 'markers');

        const unsubscribe = onSnapshot(markersCollectionRef, (snapshot) => {
            const fetchedMarkers: { lat: number; lng: number }[] = [];

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

    return { markers, setMarkers }; // Return both markers and the updater
};

export const usePlacesService = (isLoaded: boolean, mapRef: React.MutableRefObject<google.maps.Map | null>) => {
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);
        }
    }, [isLoaded, mapRef]);

    return placesServiceRef;
};

export const useBermudaTriangle = (
    bermudaTriangle: google.maps.Polygon | null,
    user: string,
    mapRef: React.MutableRefObject<google.maps.Map | null>
) => {
    useEffect(() => {
        if (bermudaTriangle && user === 'buyer') {
            bermudaTriangle.setMap(mapRef.current);
        } else {
            console.log('No bermudaTriangle found');
        }
    }, [bermudaTriangle, user, mapRef]);
};
