'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {
    Button,
    TextInput,
    PasswordInput,
    Select,
    Stack,
    Title,
    Flex,
    Paper,
    Group,
    Popover,
    Progress
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import Link from 'next/link';
import signIn from '../firebase/auth/signin';
import {useMantineTheme} from '@mantine/core';
import {PasswordRequirement, requirements, getStrength} from "../signup/password";

export default function Page() {

    const theme = useMantineTheme();

    const [email, setEmail] = useState('marius@gmail.com');
    const [password, setPassword] = useState('marius');
    const [role, setRole] = useState('buyer');
    const [visible, {toggle}] = useDisclosure(false);
    const router = useRouter();

    const [popoverOpened, setPopoverOpened] = useState(false);
    const [value, setValue] = useState('');
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)}/>
    ));

    const strength = getStrength(value);
    const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

    const handleForm = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const {result, error} = await signIn(email, password);
        if (error) {
            return console.error(error);
        }

        console.log(result);

        const redirectPath = role === 'seller' ? '/seller' : '/buyer';
        console.log(`Redirecting to ${role} page`);
        router.push(`${redirectPath}?password=${encodeURIComponent(password)}`);
    };

    return (
        <Flex
            justify="center"
            align="center"
            h="100vh"
            style={{backgroundColor: "#2e2e2e"}}
        >
            <Paper
                shadow="md"
                radius="md"
                p="xl"
                withBorder
                style={{width: '60%', maxWidth: 400}}
            >

                <Stack gap="xl">

                    <Title order={1} style={{padding: 20, textAlign: "center"}}>
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

                            <Popover opened={popoverOpened} position="bottom" width="target"
                                     transitionProps={{transition: 'pop'}}>
                                <Popover.Target>
                                    <div
                                        onFocusCapture={() => setPopoverOpened(true)}
                                        onBlurCapture={() => setPopoverOpened(false)}
                                    >
                                        <PasswordInput
                                            label="Password"
                                            placeholder="marius"
                                            type="password"
                                            visible={visible}
                                            onVisibilityChange={toggle}
                                            value={value}
                                            onChange={(event) => setValue(event.currentTarget.value)}
                                            required
                                        />
                                    </div>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Progress color={color} value={strength} size={5} mb="xs"/>
                                    <PasswordRequirement label="Includes at least 6 characters"
                                                         meets={value.length > 5}/>
                                    {checks}
                                </Popover.Dropdown>
                            </Popover>

                            <div
                                onClick={() => router.push('/forgot-password')}
                                style={{
                                    cursor: 'pointer',
                                    color: theme.colors.blue[6],
                                    fontSize: '12px',
                                    textDecoration: 'underline'
                                }}
                            >
                                Forgot password?
                            </div>


                            <Select
                                label="Role"
                                placeholder="Select role"
                                data={[
                                    {value: 'buyer', label: 'Buyer'},
                                    {value: 'seller', label: 'Seller'},
                                ]}
                                value={role}
                                onChange={(value) => setRole(value || "")}
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
                                <Button>
                                    Create an account
                                </Button>
                            </Link>
                        </Group>

                        <Link href="/" passHref>
                            <Button>
                                Back to Home
                            </Button>
                        </Link>

                    </Stack>
                </Stack>
            </Paper>
        </Flex>
    );
}
