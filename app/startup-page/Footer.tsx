import { Container, Group, Anchor } from '@mantine/core';

const links = [
    { link: '#', label: 'Contact' },
    { link: '#', label: 'Privacy' },
    { link: '#', label: 'Blog' },
    { link: '#', label: 'Careers' },
];

export default function Footer() {
    const items = links.map((link) => (
        <Anchor<'a'>
            key={link.label}
            href={link.link}
            onClick={(event) => event.preventDefault()}
            size="sm"
            style={{
                color: 'white', // Ensures the text of each link is white
                textDecoration: 'none', // Optional: removes underline if not needed
            }}
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div
            style={{
                position: 'absolute',
                top: '210vh', // Ensures it is exactly 100vh down from the previous section
                width: '100%', // Full width of the page
                backgroundColor: '#3078B7', // Example background color
                height: '60px', // Small footer height
                display: 'flex',
                alignItems: 'center', // Vertically center the content
                justifyContent: 'center', // Horizontally center the content
                zIndex: 0,
            }}
        >
            <Container>
                <Group>
                    {items}
                </Group>
            </Container>
        </div>
    );
}
