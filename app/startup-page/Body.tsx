import React from 'react';
import { Box } from '@mantine/core';
import ImagesGrid from "./ImagesGrid";


export default function Body() {
    return (
        <Box>

            {/* Contact Section */}
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
                    // zIndex: -1,
                    top: 0,
                    left: 0,
                }}
            >
                <ImagesGrid />
            </Box>

            {/*/!* Footer *!/*/}
            {/*<Footer height={60} style={{ backgroundColor: '#ECEBF3' }} py="sm">*/}
            {/*    <Text align="center" size="sm" color="#4C86A8">*/}
            {/*        You can also reach us at <i>homehunters@gmail.com</i>*/}
            {/*    </Text>*/}
            {/*</Footer>*/}
        </Box>
    );
}
