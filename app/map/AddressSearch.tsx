import React, { useEffect, useRef } from 'react';
import { TextInput } from '@mantine/core';

interface AddressSearchProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placesServiceRef: React.RefObject<google.maps.places.PlacesService | null>;
    onSearchResults: (results: google.maps.places.PlaceResult[]) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
                                                         value,
                                                         onChange,
                                                         placesServiceRef,
                                                         onSearchResults,
                                                     }) => {
    // Handle search logic for places by address
    const handleSearch = (address: string) => {
        if (placesServiceRef.current) {
            const request = {
                query: address,
                fields: ['name', 'geometry'],
            };

            placesServiceRef.current.findPlaceFromQuery(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    onSearchResults(results); // Trigger the parent callback with search results
                }
            });
        }
    };

    // Trigger search when the address input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        onChange(e); // Propagate the change to the parent component
        handleSearch(address); // Trigger the search
    };

    return (
        <TextInput
            label="Search by Address"
            placeholder="Type an address..."
            value={value}
            onChange={handleChange} // Use the handleChange function
        />
    );
};

export default AddressSearch;
