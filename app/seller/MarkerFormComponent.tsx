"use client";

import React, {useEffect, useRef, useState} from "react";
import {useForm} from "@mantine/form";
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
    Title,
} from "@mantine/core";
import AddressSearch from "../map/AddressSearch";
import {usePlacesService} from "../map/useEffectsMap";
import {Libraries, useJsApiLoader} from "@react-google-maps/api";
import {googleMapsApiKey} from "../map/config";
import {createMarker, recenterMap} from "../map/MapUtils";
import addData from "../firestore/addData";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebase_app from '../firebase/firebase-config';
import {useAuthContext} from "../context/AuthContext";
import { useMapContext } from '../map/MapContext';

const auth = getAuth(firebase_app);

const libraries: Libraries = ["places"];

export default function RentingForm() {

    const { mapRef, placesServiceRef, isLoaded } = useMapContext();
    // const mapRef = useRef<google.maps.Map | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    // Load the Google Maps API
    // const {isLoaded, loadError} = useJsApiLoader({
    //     googleMapsApiKey,
    //     libraries,
    // });

    // Initialize hooks unconditionally before rendering the map
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
    const [valueSearch, setValueSearch] = useState('');

    const [searchAddressResult, setSearchAddressResult] = useState<google.maps.places.PlaceResult[]>([]);
    const [searchAddressMarker, setSearchAddressMarker] = useState<{
        lat: number;
        lng: number;
        marker: google.maps.Marker;
    }[]>([]); // Store marker objects here

    const [user, setUser] = useState<any | null>(null);

    // Ensure placesServiceRef is initialized only after the API is loaded
    // const placesServiceRef = usePlacesService(isLoaded, mapRef);
    const {user1} = useAuthContext();
    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                // User is logged in, update state
                setUser(authUser);
                console.log("User logged in:", authUser);
            } else {
                // No user logged in, set state to null
                setUser(null);
                console.log("No user logged in");
            }
        });
        console.log('USER:', user1);

        // Cleanup the subscription on component unmount
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

        // validate: {
        //     propertyType: (value) => (value ? null : "Property type is required"),
        //     transactionType: (value) => (value ? null : "Transaction type is required"),
        //     location: (value) => (value ? null : "Location is required"),
        //     rooms: (value) => (value > 0 ? null : "Number of rooms must be greater than 0"),
        //     surface: (value) => (value > 0 ? null : "Surface must be greater than 0"),
        //     title: (value) => (value.trim().length > 0 ? null : "Title is required"),
        //     description: (value) =>
        //         value.trim().length >= 10 ? null : "Description must be at least 10 characters long",
        // },
    });

    const handleSubmit = (values: typeof form.values) => {
        setLoading(true);

        console.log('USER:', user1);

        // Simulate form submission delay
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

                console.log("Form data added to Firestore:", values);

                // Reset the form
                form.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
            } finally {
                setLoading(false);
            }
        }, 1000); // Simulated 2-second delay
    };

    const handleSearchResults = (results: google.maps.places.PlaceResult[]) => {
        searchAddressMarker.forEach((place) => place.marker.setMap(null)); // Clear all existing markers
        setSearchAddressMarker([]); // Reset state
        console.log('MARKER:', searchAddressMarker);

        if (results.length > 0) {
            const place = results[0]; // Get the top result
            console.log('TOP RESULT:', place);
            setSearchAddressResult(results);

            if (mapRef.current) {
                createMarker(place, mapRef.current, setSearchAddressMarker, infoWindowRef);
                recenterMap(mapRef, place.geometry?.location);
            }
        }
    };

    // Ensure conditional render for loading only
    if (!isLoaded) {
        return (
            <Box style={{display: "flex", justifyContent: "center", alignItems: "center", height: "600px"}}>
                <Loader/>
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
                    <Select
                        label="Property Type"
                        placeholder="Select property type"
                        mb="sm"
                        data={["Apartment", "House", "Field", "Commercial"]}
                        {...form.getInputProps("propertyType")}
                        // required
                    />

                    {/* Transaction Type Radio */}
                    <Radio.Group
                        label="Transaction Type"
                        mb="sm"
                        // required
                        {...form.getInputProps("transactionType")}
                    >
                        <Radio value="buying" label="Buying" mb="xs"/>
                        <Radio value="renting" label="Renting" mb="xs"/>
                    </Radio.Group>

                    {/* Location Address */}
                    <AddressSearch
                        value={valueSearch} // Bind the form value to AddressSearch
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setValueSearch(newValue); // Update AddressSearch's value
                            form.setFieldValue("location", newValue); // Update the form's value
                        }}
                        placesServiceRef={placesServiceRef}
                        onSearchResults={handleSearchResults}
                    />

                    {/* Number of rooms */}
                    <NumberInput
                        label="Number of Rooms"
                        placeholder="Enter number of rooms"
                        mb="sm"
                        // required
                        min={1}
                        {...form.getInputProps("rooms")}
                    />

                    {/* Surface Area */}
                    <NumberInput
                        label="Surface Area (sqm)"
                        placeholder="Enter surface area"
                        mb="sm"
                        // required
                        min={1}
                        {...form.getInputProps("surface")}
                    />

                    {/* Title */}
                    <TextInput
                        label="Title"
                        placeholder="Enter a title for your listing"
                        mb="sm"
                        // required
                        {...form.getInputProps("title")}
                    />

                    {/* Short Description */}
                    <Textarea
                        label="Short Description"
                        placeholder="Enter a brief description"
                        mb="sm"
                        // required
                        {...form.getInputProps("description")}
                        minRows={3}
                    />

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
