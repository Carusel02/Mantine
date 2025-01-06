'use client';

import Header from './startup-page/Header';
import Body from './startup-page/Body';
import Footer from './startup-page/Footer';
import {Stack} from '@mantine/core';
import {GlobalProvider} from './GlobalContext.tsx';

export default function StartupPage() {
    return (
        <GlobalProvider>
            <div>
                <Stack>
                    <Header/>
                    <Body/>
                    <Footer/>
                </Stack>
            </div>
        </GlobalProvider>
    );
}