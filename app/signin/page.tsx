'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput, Select, Stack, Title, Flex, Paper } from '@mantine/core';
import Link from 'next/link';
import signIn from '../firebase/auth/signin';
import { useMantineTheme } from '@mantine/core';



export default function Page() {

    const theme = useMantineTheme();

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

                <Stack gap="xl">

                    <Title order={1} align="center" style={{padding: 20}}>
                        Sign In
                    </Title>

                    <form onSubmit={handleForm}>
                        <Stack gap="md">
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

                    <Stack gap="xs" align="center">
                        <Link href="/" passHref>
                            <Button>
                                Back to Home
                            </Button>
                        </Link>

                        <Link href="/signup" passHref>
                            <Button>
                                Go to Sign Up
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </Flex>
    );
}
