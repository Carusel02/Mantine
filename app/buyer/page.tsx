'use client';

import * as React from 'react';
import {useEffect} from 'react';
import {useAuthContext} from '../context/AuthContext';
import {useRouter, useSearchParams} from 'next/navigation';
import addData from '../firestore/addData';
import Link from 'next/link';
import MapComponent from '../map/MapComponent';
import {Button, Box, Title, Text} from '@mantine/core';
import {collection, doc, getDocs, getFirestore, query, setDoc, where} from 'firebase/firestore';
import firebase_app from "../firebase/firebase-config";

export default function ProtectedPage() {
    const {user} = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const password = searchParams.get('password');

    useEffect(() => {
        if (!password) {
            console.warn('Password parameter is missing.');
        }
    }, [password]);

    // useEffect(() => {
    //     if (!user) router.push('/');
    // }, [user, router]);

    const db = getFirestore(firebase_app);

    useEffect(() => {
        const updateOrAddUserByEmail = async () => {
            if (user && password) {
                try {
                    // Query Firestore to check if a document with the same email exists
                    const buyersCollectionRef = collection(db, "buyers");
                    const q = query(buyersCollectionRef, where("email", "==", user.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {

                        // If email exists, update the password of the first matching document
                        const docRef = querySnapshot.docs[0].ref; // Get the document reference
                        const existingData = querySnapshot.docs[0].data();

                        console.log("Query snapshot existing data:", existingData);

                        if (existingData.password !== password) {
                            // Update the password if it's different
                            await setDoc(
                                docRef,
                                {password}, // Update the password field
                                {merge: true} // Merge the fields
                            );
                            console.log("Password updated for existing user with the same email");
                        } else {
                            console.log("Password is the same; no update needed");
                        }

                    } else {
                        // If email does not exist, create a new document
                        const newDocRef = doc(db, "buyers", user.uid);
                        await setDoc(newDocRef, {
                            email: user.email,
                            name: user.displayName,
                            photoURL: user.photoURL,
                            password,
                        });
                        console.log("New user added to Firestore");
                    }
                } catch (error) {
                    console.error("Error updating or adding user by email:", error);
                }
            } else {
                console.log("User or password is missing");
            }
        };

        updateOrAddUserByEmail();
    }, [user, password]);

    if (!user) {
        return null; // Prevent rendering until user is verified
    }

    return (
        <Box
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #eceff4, #d8dee9)',
            }}
        >
            <Title order={2} style={{textAlign: "center", color: "dark"}}>
                Protected Content
            </Title>

            <Text size="md" mt="sm" style={{textAlign: "center", color: "dimmed"}}>
                Only logged-in buyers can view this page.
            </Text>

            <Box
                mt="xl"
                style={{
                    // width: '100%',
                    // height: '400px'
                }}
            >
                <MapComponent user="buyer"/>
            </Box>

            <Box mt="xl">
                <Link href="/" passHref>
                    <Button variant="outline" size="md" color="blue">
                        Back to Home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}
