'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import addData from '../firestore/addData';
import Link from 'next/link';
import MapComponent from '../map/MapComponent';
import { Button, Box, Title, Text } from '@mantine/core';

export default function ProtectedPage() {
    const { user } = useAuthContext();
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

    useEffect(() => {
        if (user && password) {
            addData('buyers', user.uid, {
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                password,
            });

            console.log('Added user to Firestore');
        }
        else {
            console.log('User or password is missing');
        }
    }, [user, password]);

    // if (!user) {
    //     return null; // Prevent rendering until user is verified
    // }

    return (
        <Box
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #eceff4, #d8dee9)',
            }}
        >
            <Title order={2} style={{ textAlign: "center", color: "dark" }}>
                Protected Content
            </Title>
            <Text size="md" mt="sm" style={{ textAlign: "center", color: "dimmed" }}>
                Only logged-in buyers can view this page.
            </Text>
            <Box mt="xl">
                <Link href="/" passHref>
                    <Button variant="outline" size="md" color="blue">
                        Back to Home
                    </Button>
                </Link>

            </Box>
            <Box mt="xl" style={{ width: '100%', height: '400px' }}>
                <MapComponent user="user" />
            </Box>
        </Box>
    );
}
