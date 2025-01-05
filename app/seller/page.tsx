'use client'
import * as React from "react";
import {useAuthContext} from "../context/AuthContext";
import {useRouter, useSearchParams} from "next/navigation";
import addData from "../firestore/addData";
import deleteCollection from "../firestore/deleteCollection";
import Link from "next/link";
import MapComponent from "../map/MapComponent";
import MarkerFormComponent from "./MarkerFormComponent";
import {Group} from "@mantine/core";
import {GlobalProvider} from "../GlobalContext";

function Page() {
    // @ts-ignore
    const {user} = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const password = searchParams.get("password");

    React.useEffect(() => {
        if (!password) {
            console.warn("Password parameter is missing.");
        }
    }, [password, router]);

    // React.useEffect(() => {
    //     if (user == null) router.push("/");
    // }, [user]);

    console.log("user: ", user, "password: ", password);

    if (user) {
        addData("sellers", user.uid, {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            password: password,
        });

        console.log("Added user to firestore");
    }

    return (
        <GlobalProvider>
            <div>
                <h1>Only logged in sellers can view this page</h1>
                <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => deleteCollection("markers")}>
                    Delete Markers Collection
                </button>
                <Link href="/">
                    <button className="mt-4 p-2 bg-blue-500 text-white rounded">Back to Home</button>
                </Link>


                <Group justify="center" grow>
                    <MapComponent user="seller"/>
                    <MarkerFormComponent/>
                </Group>

            </div>
        </GlobalProvider>
    );
}

export default Page;
