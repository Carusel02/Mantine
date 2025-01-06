import React, { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import {
    Box,
    Button,
    Card,
    Container,
    Group,
    Loader,
    NumberInput,
    Radio,
    Select,
    Textarea,
    TextInput,
    Title
} from "@mantine/core";
import AddressSearch from "../map/AddressSearch";
import { Libraries } from "@react-google-maps/api";
import { createMarker, recenterMap } from "../map/MapUtils";
import addData from "../firestore/addData";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from '../firebase/firebase-config';
<<<<<<< HEAD
import {useAuthContext} from "../context/AuthContext";
import { useMapContext } from '../map/MapContext';
=======
import { useAuthContext } from "../context/AuthContext";
import { MapService } from '../map/MapService';
import { useGlobalState } from "../GlobalContext"; // Import the global state hook
>>>>>>> c418980095703c5d6deee177a80a004db3984ad4

const auth = getAuth(firebase_app);
const libraries: Libraries = ["places"];

export default function RentingForm() {
    // Global context for isLoaded, mapRef, and placesServiceRef
    const { isLoaded, mapRef, placesServiceRef, setMapRef, setPlacesServiceRef } = useGlobalState(); // Access global state

<<<<<<< HEAD
    const { mapRef, placesServiceRef, isLoaded } = useMapContext();
    // const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    // Load the Google Maps API
    // const {isLoaded, loadError} = useJsApiLoader({
    //     googleMapsApiKey,
    //     libraries,
    // });
=======
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    // UseEffect to update global isLoaded when the API is loaded
    useEffect(() => {
        const map = MapService.getMap();
        const placesService = MapService.getPlacesService();

        if (map) {
            setMapRef(map); // Set mapRef in the global state
            setPlacesServiceRef(placesService); // Set placesServiceRef in the global state
        }

        // Clean up the placesServiceRef when component unmounts
        return () => {
            // Resetting or handling cleanup if needed
        };
    }, [setMapRef, setPlacesServiceRef]); // Run effect to initialize map and places service

    console.log("LOADED:", isLoaded);
    console.log("MAP REF:", mapRef);
    console.log("PLACES SERVICE REF:", placesServiceRef);
>>>>>>> c418980095703c5d6deee177a80a004db3984ad4

    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [valueSearch, setValueSearch] = useState('');
    const [searchAddressResult, setSearchAddressResult] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchAddressMarker, setSearchAddressMarker] = useState<{
        lat: number;
        lng: number;
        marker: google.maps.Marker
    }[]>([]);
    const [user, setUser] = useState<any | null>(null);

<<<<<<< HEAD
    // Ensure placesServiceRef is initialized only after the API is loaded
    // const placesServiceRef = usePlacesService(isLoaded, mapRef);
    const {user1} = useAuthContext();
=======
    const { user1 } = useAuthContext();
>>>>>>> c418980095703c5d6deee177a80a004db3984ad4
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const form = useForm({
        initialValues: {
            propertyType: "",
            transactionType: "renting",
            location: "",
            rooms: 1,
            surface: 0,
            title: "",
            description: "",
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        setLoading(true);
        setTimeout(async () => {
            try {
                const propertyId = Date.now().toString();
                const firestoreResult = await addData("properties", propertyId, {
                    propertyType: values.propertyType,
                    transactionType: values.transactionType,
                    location: values.location,
                    rooms: values.rooms,
                    surface: values.surface,
                    title: values.title,
                    description: values.description,
                    timestamp: new Date(),
                    userId: user?.uid,
                    userEmail: user?.email,
                });

                form.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const handleSearchResults = (results: google.maps.places.PlaceResult[]) => {
        searchAddressMarker.forEach((place) => place.marker.setMap(null));
        setSearchAddressMarker([]);

        if (results.length > 0) {
            const place = results[0];
            setSearchAddressResult(results);

            if (mapRef) {
                createMarker(place, mapRef.current, setSearchAddressMarker, infoWindowRef);
                recenterMap(mapRef, place.geometry?.location);
            }
        }
    };

    if (!isLoaded) {
        return (
            <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px" }}>
                <Loader />
            </Box>
        );
    }

    return (
        <Container size="sm">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group align="center" justify="center">
                    <Title order={2} mb="lg">
                        Renting Registration Form
                    </Title>
                </Group>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {/* Property Type Dropdown */}
                    <Select label="Property Type" placeholder="Select property type" mb="sm"
                            data={["Apartment", "House", "Field", "Commercial"]} {...form.getInputProps("propertyType")} />

                    {/* Transaction Type Radio */}
                    <Radio.Group label="Transaction Type" mb="sm" {...form.getInputProps("transactionType")}>
                        <Radio value="buying" label="Buying" mb="xs" />
                        <Radio value="renting" label="Renting" mb="xs" />
                    </Radio.Group>

                    {/* Location Address */}
                    <AddressSearch value={valueSearch} onChange={(e) => {
                        const newValue = e.target.value;
                        setValueSearch(newValue);
                        form.setFieldValue("location", newValue);
                    }} placesServiceRef={placesServiceRef} onSearchResults={handleSearchResults} />

                    {/* Number of rooms */}
                    <NumberInput label="Number of Rooms" placeholder="Enter number of rooms" mb="sm"
                                 min={1} {...form.getInputProps("rooms")} />

                    {/* Surface Area */}
                    <NumberInput label="Surface Area (sqm)" placeholder="Enter surface area" mb="sm"
                                 min={1} {...form.getInputProps("surface")} />

                    {/* Title */}
                    <TextInput label="Title" placeholder="Enter a title for your listing"
                               mb="sm" {...form.getInputProps("title")} />

                    {/* Short Description */}
                    <Textarea label="Short Description" placeholder="Enter a brief description"
                              mb="sm" {...form.getInputProps("description")} minRows={3} />

                    {/* Submit Button */}
                    <Group align="center" justify="center" mt="md">
                        <Button type="submit" loading={loading}>
                            Submit
                        </Button>
                    </Group>
                </form>
            </Card>
        </Container>
    );
}
