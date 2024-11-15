'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput, Select, Stack, Title, Flex, Paper } from '@mantine/core';
import Link from 'next/link';
import { TERRACOTTA_RED, LIGHT_BEIGE } from '../config';
import signIn from '../firebase/auth/signin';

export default function Page() {
    const [email, setEmail] = useState('marius@gmail.com');
    const [password, setPassword] = useState('marius');
    const [role, setRole] = useState('user');
    const router = useRouter();

    const handleForm = async (event) => {
        event.preventDefault();

        const { result, error } = await signIn(email, password);
        if (error) {
            return console.error(error);
        }

        console.log(result);

        const redirectPath = role === 'admin' ? '/admin' : '/user';
        console.log(`Redirecting to ${role} page`);
        router.push(`${redirectPath}?password=${encodeURIComponent(password)}`);
    };

    return (
        <Flex
            align="center"
            justify="center"
        >
            <Paper
                shadow="md"
                radius="md"
                padding="xl"
            >
                <Stack spacing="md">
                    <Title order={1} align="center">
                        Sign In
                    </Title>

                    <form onSubmit={handleForm}>
                        <Stack spacing="sm">
                            <TextInput
                                label="Email"
                                placeholder="marius@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <TextInput
                                label="Password"
                                placeholder="marius"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Select
                                label="Role"
                                placeholder="Select role"
                                data={[
                                    { value: 'user', label: 'User' },
                                    { value: 'admin', label: 'Admin' },
                                ]}
                                value={role}
                                onChange={setRole}
                            />

                            <Button type="submit" fullWidth>
                                Sign In
                            </Button>
                        </Stack>
                    </form>

                    <Stack spacing="xs" align="center">
                        <Link href="/" passHref>
                            <Button
                                variant="outline"
                            >
                                Back to Home
                            </Button>
                        </Link>

                        <Link href="/signup" passHref>
                            <Button
                                variant="outline"
                            >
                                Go to Sign Up
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </Flex>
    );
}
