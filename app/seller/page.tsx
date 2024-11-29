'use client'
import * as React from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import addData from "../firestore/addData";
import deleteCollection from "../firestore/deleteCollection";
import Link from "next/link";
import MapComponent from "../map/MapComponent";
import MarkerFormComponent from "./MarkerFormComponent";

function Page() {
    const { user } = useAuthContext();
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
            <MapComponent user="seller"/>
            <MarkerFormComponent />
        </div>
    );
}

export default Page;
