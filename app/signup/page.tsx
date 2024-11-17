'use client';

import React, { useState } from 'react';
import { Button, TextInput, Select, Stack, Title, Paper, Center, Flex} from '@mantine/core';
import signUp from '../firebase/auth/signup';
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

        const { result, error } = await signUp(email, password);

        if (error) {
            console.error('Sign-Up Error:', error);
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
        <Flex
            justify="center"
            align="center"
            h="100vh"
            style={{ backgroundColor: "#2e2e2e" }}
        >
            <Paper
                shadow="md"
                radius="md"
                p="xl"
                withBorder
                style={{ width: '60%', maxWidth: 300}}
            >

                <form onSubmit={handleForm}>
                    <Stack gap="md">
                        <Title order={1} align="center" style={{padding: 20}}>
                            Sign Up
                        </Title>

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
                            Register
                        </Button>
                    </Stack>
                </form>
                <Stack gap="sm" mt="xl" align="center">
                    <Link href="/">
                        <Button>
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/signin" passHref>
                        <Button>
                            Go to Sign In
                        </Button>
                    </Link>
                </Stack>
            </Paper>
        </Flex>
    );
}
