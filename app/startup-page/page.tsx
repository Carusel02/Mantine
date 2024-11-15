'use client';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import { Stack } from '@mantine/core';

export default function StartupPage() {
    return (
        <div>
            <Stack>
                <Header />
                <Body   />
                <Footer />
            </Stack>
        </div>
    );
}