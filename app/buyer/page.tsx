'use client';

import React, {useEffect} from 'react';
import {useAuthContext} from '../context/AuthContext';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button, Stack} from '@mantine/core';
import Link from 'next/link';
import MapComponent from '../map/MapComponent';
import {collection, doc, getDocs, getFirestore, query, setDoc, where} from 'firebase/firestore';
import firebase_app from '../firebase/firebase-config';

export default function ProtectedPage() {
    const {user} = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const password = searchParams.get('password');
    const db = getFirestore(firebase_app);

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

    return (
        <Stack align="center" justify="center">
            
            <MapComponent user="buyer" />

            <Link href="/" passHref>
                <Button variant="filled" color="blue" size="sm">
                    Back to Home
                </Button>
            </Link>

        </Stack>
    );
}
