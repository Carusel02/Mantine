import {useEffect, useRef, useState} from 'react';
import {collection, getFirestore, onSnapshot} from 'firebase/firestore';
import firebase_app from '../firebase/firebase-config';


export const useFetchMarkers = (userType: string, user: any) => {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
    const db = getFirestore(firebase_app);

    console.log("User: ", user);
    console.log("User type: ", userType);
    let userId = user ? user.uid : null;

    useEffect(() => {
        const propertiesCollectionRef = collection(db, 'properties');

        const unsubscribe = onSnapshot(propertiesCollectionRef, (snapshot) => {
            const fetchedMarkers: { lat: number; lng: number }[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.marker && data.marker.lat && data.marker.lng) {
                    if(userType === 'buyer' || (userType === 'seller' && data.userId === userId)) {

                        console.log('data.userId:', data.userId);
                        console.log('userId:', userId);
                        console.log('User type:', userType);
                        console.log('User has permission to view marker.');

                        fetchedMarkers.push({
                            lat: data.marker.lat,
                            lng: data.marker.lng,
                        });
                    }
                }
            });

            setMarkers(fetchedMarkers);
            console.log('Fetched markers:', fetchedMarkers);
        });

        return () => unsubscribe();
    }, [db]);

    return {markers, setMarkers}; // Return both markers and the updater
};

export const usePlacesService = (isLoaded: boolean, mapRef: React.MutableRefObject<google.maps.Map | null>) => {
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        console.log('isLoaded:', isLoaded);
        console.log('mapRef:', mapRef.current)
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
