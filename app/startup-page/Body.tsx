import React from 'react';
import {Box} from '@mantine/core';
import ImagesGrid from "./ImagesGrid";


export default function Body() {
    return (
        <Box
            id="contact"
            style={{
                // background: '#0A0F0D',
                background: '#B1DDF1',
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        >
            <ImagesGrid/>
        </Box>
    );
}
