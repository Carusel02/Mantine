'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Button,
    TextInput,
    Select,
    Stack,
    Title,
    Flex,
    Paper,
    Group, PasswordInput,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import signIn from '../firebase/auth/signin';
import {useDisclosure} from "@mantine/hooks";

export default function Page() {
    const theme = useMantineTheme();

    const [email, setEmail] = useState('marius@gmail.com');
    const [password, setPassword] = useState('marius');
    const [role, setRole] = useState('buyer');
    const [visible, { toggle }] = useDisclosure(false);
    const router = useRouter();

    const handleForm = async (event: { preventDefault: () => void }) => {
        event.preventDefault();

        const { result, error } = await signIn(email, password);
        if (error) {
            return console.error(error);
        }

        console.log(result);

        const redirectPath = role === 'seller' ? '/seller' : '/buyer';
        console.log(`Redirecting to ${role} page`);
        router.push(`${redirectPath}?password=${encodeURIComponent(password)}`);
    };

    return (
        <Flex justify="center" align="center" h="100vh" style={{ backgroundColor: '#2e2e2e' }}>
            <Paper shadow="md" radius="md" p="xl" withBorder style={{ width: '60%', maxWidth: 400 }}>
                <Stack gap="xl">
                    <Title order={1} style={{ padding: 20, textAlign: 'center' }}>
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

                            <PasswordInput
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                visible={visible}
                                onVisibilityChange={toggle}
                                required
                            />



                            <div
                                onClick={() => router.push('/forgot-password')}
                                style={{
                                    cursor: 'pointer',
                                    color: theme.colors.blue[6],
                                    fontSize: '12px',
                                    textDecoration: 'underline',
                                }}
                            >
                                Forgot password?
                            </div>

                            <Select
                                label="Role"
                                placeholder="Select role"
                                data={[
                                    { value: 'buyer', label: 'Buyer' },
                                    { value: 'seller', label: 'Seller' },
                                ]}
                                value={role}
                                onChange={(value) => setRole(value || '')}
                            />

                            <Button type="submit" fullWidth>
                                Sign In
                            </Button>

                            <div>Sign in with Google / Facebook</div>
                        </Stack>
                    </form>

                    <Stack gap="xs" align="center">
                        <Group>
                            <div>New to HomeHunters?</div>
                            <Link href="/signup" passHref>
                                <Button>Create an account</Button>
                            </Link>
                        </Group>

                        <Link href="/" passHref>
                            <Button>Back to Home</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </Flex>
    );
}
