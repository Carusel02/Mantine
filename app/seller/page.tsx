'use client'
import React, {useEffect, useRef, useState} from 'react';

import {useAuthContext} from "../context/AuthContext";
import {useRouter, useSearchParams} from "next/navigation";
import addData from "../firestore/addData";
import deleteCollection from "../firestore/deleteCollection";
import Link from "next/link";
import MapComponent from "../map/MapComponent";
import MarkerFormComponent from "./MarkerFormComponent";
import {Group, Stack} from "@mantine/core";
import {MapProvider} from '../map/MapContext';
import {usePlacesService} from '../map/useEffectsMap';
import {Libraries, useJsApiLoader} from '@react-google-maps/api';
import {googleMapsApiKey} from '../map/config';
import {CardsCarousel} from "../components/CardsCarousel";
import {fetchProperties} from "../map/useEffectsMap";

const libraries: Libraries = ['places'];

function Page() {
    // @ts-ignore
    const {user} = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const password = searchParams.get("password");

    React.useEffect(() => {
        if (!password) {
            console.warn("Password parameter is missing.");
        }
    }, [password, router]);

    // React.useEffect(() => {
    //     if (user == null) router.push("/");
    // }, [user]);

    console.log("user: ", user, "password: ", password);

    if (user) {
        addData("sellers", user.uid, {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            password: password,
        });

        console.log("Added user to firestore");
    }

    const mapRef = useRef<google.maps.Map | null>(null);

    const {isLoaded, loadError} = useJsApiLoader({
        googleMapsApiKey,
        libraries,
    });

    const placesServiceRef = usePlacesService(isLoaded, mapRef);

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const loadProperties = async () => {
            const data = await fetchProperties(user);
            setProperties(data);
        };

        loadProperties().then(r => console.log("Properties loaded"));
    }, []);

    return (
        <MapProvider
            mapRef={mapRef}
            placesServiceRef={placesServiceRef}
            isLoaded={isLoaded}
        >
            <div>
                <h1>Only logged in sellers can view this page</h1>
                <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => deleteCollection("markers")}>
                    Delete Markers Collection
                </button>
                <Link href="/">
                    <button className="mt-4 p-2 bg-blue-500 text-white rounded">Back to Home</button>
                </Link>

                <Stack align="center" justify="center">
                    <Group justify="center" grow>
                        <MapComponent userType="seller"/>
                        <MarkerFormComponent/>
                    </Group>
                    
                    <CardsCarousel data = {properties}/>
                </Stack>



            </div>
        </MapProvider>
    );
}

export default Page;
