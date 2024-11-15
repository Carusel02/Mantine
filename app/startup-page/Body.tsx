import React from 'react';
import { Button, Container, Stack, Text, Title, Box, Group, Image, NavLink } from '@mantine/core';
import Link from 'next/link';
import { LIGHT_BEIGE, TERRACOTTA_RED } from '../config';


export default function Body() {
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
