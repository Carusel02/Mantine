import {Carousel} from '@mantine/carousel';
import {Button, Paper, Text, Title, useMantineTheme} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import classes from './CardsCarousel.module.css';

interface CardProps {
    propertyType: string;
    transactionType: string;
    location: string;
    rooms: number;
    surface: number;
    title: string;
    description: string;
    price: number;
    timestamp: Date;
}

function Card({propertyType, transactionType, location, rooms, surface, title, description, price, timestamp}: CardProps) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            className={classes.card}
        >
            <div>
                <Text className={classes.category} size="xs">
                    {propertyType}
                </Text>
                <Title order={3} className={classes.title}>
                    {title}
                </Title>
                <Title order={3} className={classes.category}>
                    {transactionType}
                </Title>
                <Text className={classes.category}>
                    {location}
                </Text>
                <Text className={classes.category}>
                    {rooms} rooms
                </Text>
                <Text className={classes.category}>
                    {surface} sqm
                </Text>
                <Text className={classes.category}>
                    €{price}
                </Text>
                <Text className={classes.category}>
                    {description}
                </Text>

            </div>
            {/*<Button variant="white" color="dark">*/}
            {/*    Read article*/}
            {/*</Button>*/}
        </Paper>
    );
}

interface CardsCarouselProps {
    data?: any[]
}

export function CardsCarousel({data}: CardsCarouselProps) {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const slides = data?.map((item) => (
        <Carousel.Slide key={item.timestamp}>
            <Card {...item} />
        </Carousel.Slide>
    ));

    return (
        <Carousel
            slideSize={{base: '100%', sm: '50%'}}
            slideGap={{base: 2, sm: 'xl'}}
            align="start"
            slidesToScroll={2}
            w='70%'
            dragFree
            withIndicators
            m="1.5rem"
        >
            {slides}
        </Carousel>
    );
}