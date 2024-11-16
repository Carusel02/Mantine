import {Group, Image} from '@mantine/core';
import {useState} from 'react';

export default function HoverImages() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <Group
            spacing="lg"
            style={{
                display: 'flex',
                flexWrap: 'wrap', // Ensures that images are wrapped to new lines if necessary
                gap: '25px', // Space between images
                justifyContent: 'center', // Center images in the group
                marginTop: '50px', // Add some space at the top
                marginBottom: 'auto', // Add some space at the bottom
                marginLeft: '50px', // Center the group horizontally
                marginRight: '50px', // Center the group horizontally
            }}
        >
            {['/img.png', '/img_1.png', '/img_2.png', '/img_3.png', '/img_4.png', '/img_5.png',
                '/img_1.png', '/img_5.png', '/img_2.png', '/img_4.png', '/img.png', '/img_3.png',
                '/img.png', '/img_2.png', '/img_5.png', '/img_3.png', '/img_1.png', '/img_4.png'].map((src, index) => {
                const isHovered = index === hoveredIndex;

                return (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            width: '250px',
                            height: '250px',
                            transition: 'transform 0.3s ease-in-out, margin 0.3s ease-in-out',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            zIndex: isHovered ? 1 : 0, // Ensure hovered image stays on top
                            // margin: isHovered ? '20px' : '0', // Adjust margin to create spacing when hovered
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Image
                            src={src}
                            width="100%"
                            height="100%"
                            alt={`Image ${index + 1}`}
                            style={{objectFit: 'cover'}}
                        />
                    </div>
                );
            })}
        </Group>
    );
}
