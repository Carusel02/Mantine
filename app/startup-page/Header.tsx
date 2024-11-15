import { Overlay, Container, Title, Button, Text } from '@mantine/core';
import classes from './Header.module.css';

export default function Header() {
    return (
        <div className={classes.hero}>
            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
                opacity={1}
                zIndex={0}
            />
            <Container className={classes.container} size="md">
                <Title className={classes.title}>HomeHunters</Title>
                <Text className={classes.description} size="xl" mt="xl">
                    Buying & selling has never been so simple.
                    Now, everything you need to successfully buy or sell your home is on one platform.
                </Text>

                <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
                    Get started
                </Button>

            </Container>
        </div>
    );
}