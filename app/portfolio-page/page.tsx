'use client';

import React from 'react';
import { Button, Container, Stack, Text, Title, Box, Group, Image, NavLink } from '@mantine/core';
import Link from 'next/link';
import { LIGHT_BEIGE, TERRACOTTA_RED } from '../config';
import HomePage from "../page";

export default function PortfolioPage() {
    return (
        <Box
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100vw',
                minHeight: '100vh',
            }}
        >
            {/* Navigation Bar */}
            <Box
                style={{
                    background: 'linear-gradient(to right, #4C86A8, #9198E5)',
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 10,
                }}
            >
                <Container>
                    <Group position="right" spacing="lg" py="sm">

                            <NavLink label="About" />

                            <NavLink label="Work" />

                            <NavLink label="Contact" />


                    </Group>
                </Container>
            </Box>


            <Container >
                <HomePage/>
            </Container>



            {/*/!* Welcome Section *!/*/}
            {/*<Container id="welcome-section" py="xl" style={{ minHeight: '100vh' }}>*/}
            {/*    <Stack align="center" spacing="lg">*/}
            {/*        <Title align="center" color="white" className="hover:scale-105" order={1}>*/}
            {/*            Welcome to HomeHunters!*/}
            {/*        </Title>*/}

            {/*        <Stack spacing="sm">*/}
            {/*            <Text align="center" color="white" size="lg">*/}
            {/*                Have an account?*/}
            {/*            </Text>*/}
            {/*            <Link href={"/signin"} passHref>*/}
            {/*                <Button variant="light" color="blue">*/}
            {/*                    Go to Sign In*/}
            {/*                </Button>*/}
            {/*            </Link>*/}

            {/*            <Text align="center" color="white" size="lg">*/}
            {/*                Don't have an account?*/}
            {/*            </Text>*/}



            {/*            <Link href={"/signup"} passHref>*/}
            {/*            <Button variant="light" color="blue">*/}
            {/*                Go to Sign Up*/}
            {/*            </Button>*/}
            {/*            </Link>*/}

            {/*        </Stack>*/}

            {/*        <Stack spacing="sm">*/}


            {/*            <Link href="/another-page" passHref>*/}
            {/*            <Button variant="light" color="blue">*/}
            {/*                Go to Another Page*/}
            {/*            </Button>*/}
            {/*            </Link>*/}

            {/*            <Link href="/portfolio-page" passHref>*/}
            {/*            <Button variant="light" color="blue">*/}
            {/*                Go to Portfolio*/}
            {/*            </Button>*/}
            {/*            </Link>*/}


            {/*        </Stack>*/}


            {/*    </Stack>*/}
            {/*</Container>*/}



            {/* Contact Section */}
            <Box
                id="contact"
                style={{
                    background: 'linear-gradient(45deg, #A7BEAE 50%, #E7E8D1 50%)',
                    width: '100vw',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Group spacing="lg">
                    {['/img.png', '/img_1.png', '/img_2.png', '/img_3.png', '/img_4.png', '/img_5.png'].map(
                        (src, index) => (
                            <Image key={index} src={src} width={200} height={200} radius="md" alt={`Image ${index + 1}`} />
                        )
                    )}
                </Group>
            </Box>

            {/* Back to Home Button */}
            <Container mt="lg" align="center">

                <Link href="/" passHref>
                    <Button
                        variant="outline"
                        style={{
                            backgroundColor: LIGHT_BEIGE,
                            color: TERRACOTTA_RED,
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        Back to Home
                    </Button>

                </Link>

            </Container>

            {/*/!* Footer *!/*/}
            {/*<Footer height={60} style={{ backgroundColor: '#ECEBF3' }} py="sm">*/}
            {/*    <Text align="center" size="sm" color="#4C86A8">*/}
            {/*        You can also reach us at <i>homehunters@gmail.com</i>*/}
            {/*    </Text>*/}
            {/*</Footer>*/}
        </Box>
    );
}
