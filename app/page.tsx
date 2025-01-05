'use client';

import Header from './startup-page/Header';
import Body from './startup-page/Body';
import Footer from './startup-page/Footer';
import {Stack} from '@mantine/core';
import {GlobalProvider} from './GlobalContext.tsx';
import {AuthContextProvider} from "./context/AuthContext";

export default function StartupPage() {
    return (
        <GlobalProvider>
            <AuthContextProvider>
                <div>
                    <Stack>
                        <Header/>
                        <Body/>
                        <Footer/>
                    </Stack>
                </div>
            </AuthContextProvider>
        </GlobalProvider>
    )
        ;
}