import React from 'react';
import { Button, Container, Stack, Text, Title, Box, Group, Image, NavLink } from '@mantine/core';
import Link from 'next/link';
import { LIGHT_BEIGE, TERRACOTTA_RED } from '../config';
import ImagesGrid from "./ImagesGrid";


export default function Body() {
    return (
        <Box
            style={{
                // backgroundImage: "url('/bg.png')",
                // backgroundSize: 'cover',
                // backgroundPosition: 'center',
                // width: '100vw',
                // minHeight: '100vh',
            }}
        >

            {/* Contact Section */}
            <Box
                id="contact"
                style={{
                    background: '#0A0F0D',
                    width: '100vw',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    // zIndex: -1,
                    top: 0,
                    left: 0,
                }}
            >
                <ImagesGrid />
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
