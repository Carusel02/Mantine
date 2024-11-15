'use client';

import React, { useState } from 'react';
import { Button, TextInput, Select, Stack, Title, Paper, Center } from '@mantine/core';
import signIn from '../firebase/auth/signin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TERRACOTTA_RED, LIGHT_BEIGE } from '../config';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const router = useRouter();

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();

        const { result, error } = await signIn(email, password);

        if (error) {
            console.error('Sign-in Error:', error);
            return;
        }

        switch (role) {
            case 'admin':
                console.log('Redirecting to admin page', result);
                router.push(`/admin?password=${encodeURIComponent(password)}`);
                break;

            case 'user':
                console.log('Redirecting to user page', result);
                router.push(`/user?password=${encodeURIComponent(password)}`);
                break;

            default:
                console.log('Invalid role');
        }
    };

    return (
        <Center>
            <Paper
                radius="md"
                p="xl"
                shadow="sm"
            >
                <Title order={2}>
                    Sign In
                </Title>

                <form onSubmit={handleForm}>
                    <Stack spacing="md">
                        <TextInput
                            label="Email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                        <Select
                            label="Role"
                            placeholder="Select your role"
                            value={role}
                            onChange={(value) => setRole(value || 'user')}
                            data={[
                                { value: 'user', label: 'User' },
                                { value: 'admin', label: 'Admin' },
                            ]}
                        />
                        <Button type="submit" fullWidth style={{ backgroundColor: TERRACOTTA_RED }}>
                            Sign In
                        </Button>
                    </Stack>
                </form>
                <Stack spacing="sm" mt="lg">
                    <Link href="/">
                        <Button  fullWidth>
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/signin" passHref>
                        <Button fullWidth>
                            Go to Sign Up
                        </Button>
                    </Link>
                </Stack>
            </Paper>
        </Center>
    );
}
