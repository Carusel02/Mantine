'use client';

import React, {useEffect, useRef} from 'react';
import {GoogleMap, Marker} from '@react-google-maps/api';
import {defaultCenter} from './config';
import {recenterMap} from './MapUtils';

interface GoogleMapComponentProps {
    markers: { lat: number; lng: number }[];
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

    useEffect(() => {
        if (userLocation) {
            recenterMap(mapRef, userLocation);
        }
    }, [userLocation]);

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
            {markers.map((marker, index) => (
                <Marker key={index} position={{lat: marker.lat, lng: marker.lng}}/>
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
    );
};

export default GoogleMapComponent;
