'use client';

import React, {useEffect, useRef} from 'react';
import {useAuthContext} from '../context/AuthContext';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button, Stack} from '@mantine/core';
import Link from 'next/link';
import MapComponent from '../map/MapComponent';
import {collection, doc, getDocs, getFirestore, query, setDoc, where} from 'firebase/firestore';
import firebase_app from '../firebase/firebase-config';
import {MapProvider} from "../map/MapContext";
import {Libraries, useJsApiLoader} from "@react-google-maps/api";
import {googleMapsApiKey} from "../map/config";
import {usePlacesService} from "../map/useEffectsMap";
import {getAuth, signOut} from "firebase/auth";

export default function ProtectedPage() {
    // @ts-ignore
    const {user} = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const password = searchParams.get('password');
    const db = getFirestore(firebase_app);

    const libraries: Libraries = ['places'];

    useEffect(() => {
        if (!password) {
            console.warn('Password parameter is missing.');
        }
    }, [password]);

    useEffect(() => {
        const updateOrAddUserByEmail = async () => {
            if (user && password) {
                try {
                    const buyersCollectionRef = collection(db, 'buyers');
                    const q = query(buyersCollectionRef, where('email', '==', user.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const docRef = querySnapshot.docs[0].ref;
                        const existingData = querySnapshot.docs[0].data();

                        if (existingData.password !== password) {
                            await setDoc(docRef, {password}, {merge: true});
                            console.log('Password updated for existing user with the same email');
                        } else {
                            console.log('Password is the same; no update needed');
                        }
                    } else {
                        const newDocRef = doc(db, 'buyers', user.uid);
                        await setDoc(newDocRef, {
                            email: user.email,
                            name: user.displayName,
                            photoURL: user.photoURL,
                            password,
                        });
                        console.log('New user added to Firestore');
                    }
                } catch (error) {
                    console.error('Error updating or adding user by email:', error);
                }
            } else {
                console.log('User or password is missing');
            }
        };

        updateOrAddUserByEmail();
    }, [user, password]);

    if (!user) {
        return null;
    }

    const mapRef = useRef<google.maps.Map | null>(null);

    const {isLoaded, loadError} = useJsApiLoader({
        googleMapsApiKey,
        libraries,
    });

    const placesServiceRef = usePlacesService(isLoaded, mapRef);

    const auth = getAuth(firebase_app);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <MapProvider
            mapRef={mapRef}
            placesServiceRef={placesServiceRef}
            isLoaded={isLoaded}
        >
            <Stack align="center" justify="center">

                <MapComponent userType="buyer"/>

                <Link href="/" passHref>
                    <Button
                        variant="filled"
                        color="blue"
                        size="sm"
                        // onClick={handleLogout}
                    >
                        Back to Home
                    </Button>
                </Link>

            </Stack>
        </MapProvider>
    );
}
