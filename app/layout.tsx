import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import React from "react";
import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import {theme} from "../theme";
import {AuthContextProvider} from "./context/AuthContext";

export const metadata = {
    title: "HomeHunters",
    description: "Best real estate app!",
};


export default function RootLayout({children}: { children: any }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <ColorSchemeScript/>
            {/* <link rel="shortcut icon" href="/favicon.svg"/> */}
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </MantineProvider>
        </body>


        </html>
    );
}
