'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { defaultCenter } from './config';
import { recenterMap } from './MapUtils';

interface GoogleMapComponentProps {
    markers: { lat: number; lng: number; content: string }[];
    userLocation: { lat: number; lng: number } | null;
    onMapClick: (event: google.maps.MapMouseEvent) => void;
    onMapDblClick: (event: google.maps.MapMouseEvent) => void;
    onMapLoad: (map: google.maps.Map) => void;
}

const containerStyle = {
    width: '100%',
    height: '600px',
    cursor: 'pointer',
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
                                                                   markers,
                                                                   userLocation,
                                                                   onMapClick,
                                                                   onMapDblClick,
                                                                   onMapLoad,
                                                               }) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    // Store the marker references
    const markerRefs = useRef<(google.maps.Marker | null)[]>([]);
    const [currentMarkerIndex, setCurrentMarkerIndex] = useState<number | null>(null);

    useEffect(() => {
        if (userLocation) {
            recenterMap(mapRef, userLocation);
        }
    }, [userLocation]);

    useEffect(() => {
        // Create the InfoWindow once, rather than on every click.
        if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow();
        }

        // Open the info window on marker click
        if (currentMarkerIndex !== null && markerRefs.current[currentMarkerIndex]) {
            const marker = markerRefs.current[currentMarkerIndex];
            const markerData = markers[currentMarkerIndex];

            // Set content and open the InfoWindow
            infoWindowRef.current.setContent(markerData.content);
            infoWindowRef.current.open(mapRef.current, marker);
        }
    }, [currentMarkerIndex, markers]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || defaultCenter}
            zoom={10}
            onClick={onMapClick}
            onDblClick={onMapDblClick}
            onLoad={(map) => {
                mapRef.current = map;
                onMapLoad(map);
            }}
        >
            {markers.map((markerData, index) => {
                return (
                    <Marker
                        key={index}
                        position={{ lat: markerData.lat, lng: markerData.lng }}
                        title={markerData.content}
                        onLoad={(marker) => {
                            markerRefs.current[index] = marker;
                        }}
                        onClick={() => {
                            setCurrentMarkerIndex(index);
                        }}
                    />
                );
            })}

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
    );
};

export default GoogleMapComponent;
