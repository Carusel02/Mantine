import {Box, Button, Container, Image, Overlay, Text, Title} from '@mantine/core';
import classes from './Header.module.css';
import Link from "next/link";

export default function Header() {
    return (
        <div>
            <Image
                radius="md"
                w={200}
                src="/logo.png"
                alt="HomeHunters logo"
                style={
                    {
                        marginBottom: '2rem',
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 2,
                    }
                }
            />

            <Box
                className={classes.hero}
                style={{
                    backgroundImage: "url('/bg-2.jpg')", // Path to your background image
                    backgroundSize: "cover", // Ensures the image covers the entire Box
                    backgroundPosition: "center", // Centers the image
                    backgroundRepeat: "no-repeat", // Prevents tiling
                    height: "100vh", // Full viewport height
                    zIndex: 1, // Ensures the Box is behind the content
                }}
            >
                <Overlay
                    gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
                    opacity={1}
                    zIndex={0}
                />
                <Container className={classes.container} size="md" h="100vh">


                    <Title className={classes.title}>HomeHunters</Title>
                    <Text className={classes.description} size="xl" mt="xl">
                        Buying & selling has never been so simple.
                        Now, everything you need to successfully buy or sell your home is on one platform.
                    </Text>

                    <Link href="/signin" passHref>
                        <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
                            Log in to start
                        </Button>
                    </Link>
                </Container>
            </Box>
        </div>
    );
}
