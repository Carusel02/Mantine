"use client";

import React, { useRef, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Container,
  TextInput,
  Textarea,
  Select,
  Radio,
  NumberInput,
  Button,
  Group,
  Title,
  Card,
  Box,
  Loader,
} from "@mantine/core";
import AddressSearch from "../map/AddressSearch";
import { usePlacesService } from "../map/useEffectsMap";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { googleMapsApiKey } from "../map/config";
import { createMarkerAddressSearch, recenterMap } from "../map/MapUtils";

const libraries: Libraries = ["places"];

export default function RentingForm() {

  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey,
    libraries,
  });

  // Initialize hooks unconditionally before rendering the map
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
  const [valueSearch, setValueSearch] = useState('');
  const [searchAddressMarker, setSearchAddressMarker] = useState<{
    lat: number;
    lng: number;
    marker: google.maps.Marker | null;
  }>({
    lat: 0,
    lng: 0,
    marker: null,
  });

  // Ensure placesServiceRef is initialized only after the API is loaded
  const placesServiceRef = usePlacesService(isLoaded, mapRef);

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

    validate: {
      propertyType: (value) => (value ? null : "Property type is required"),
      transactionType: (value) => (value ? null : "Transaction type is required"),
      location: (value) => (value ? null : "Location is required"),
      rooms: (value) => (value > 0 ? null : "Number of rooms must be greater than 0"),
      surface: (value) => (value > 0 ? null : "Surface must be greater than 0"),
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      description: (value) =>
          value.trim().length >= 10 ? null : "Description must be at least 10 characters long",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);

    // Simulate form submission delay
    setTimeout(() => {
      console.log("Submitted data:", values);

      // Reset the form
      form.reset();
      setLoading(false);
    }, 2000); // Simulated 2-second delay
  };

  const handleSearchResults = (results: google.maps.places.PlaceResult[]) => {
    setSearchResults(results);
    if (mapRef.current) {
      results.forEach((place) => createMarkerAddressSearch(place, mapRef.current, setSearchAddressMarker, infoWindowRef));
    }
    recenterMap(mapRef, results[0].geometry?.location);
  };

  // Ensure conditional render for loading only
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
            <Select
                label="Property Type"
                placeholder="Select property type"
                mb="sm"
                data={["Apartment", "House", "Field", "Commercial"]}
                {...form.getInputProps("propertyType")}
                required
            />

            {/* Transaction Type Radio */}
            <Radio.Group
                label="Transaction Type"
                mb="sm"
                required
                {...form.getInputProps("transactionType")}
            >
              <Radio value="buying" label="Buying" mb="xs" />
              <Radio value="renting" label="Renting" mb="xs" />
            </Radio.Group>

            {/* Location Address */}
            <AddressSearch
                value={form.values.location} // Bind the form value to AddressSearch
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
                required
                min={1}
                {...form.getInputProps("rooms")}
            />

            {/* Surface Area */}
            <NumberInput
                label="Surface Area (sqm)"
                placeholder="Enter surface area"
                mb="sm"
                required
                min={1}
                {...form.getInputProps("surface")}
            />

            {/* Title */}
            <TextInput
                label="Title"
                placeholder="Enter a title for your listing"
                mb="sm"
                required
                {...form.getInputProps("title")}
            />

            {/* Short Description */}
            <Textarea
                label="Short Description"
                placeholder="Enter a brief description"
                mb="sm"
                required
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
