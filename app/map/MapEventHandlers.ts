import {addMarker} from './MapUtils';

export const handleMapClick = (
    event: google.maps.MapMouseEvent,
    user: string,
    setMarkers: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }[]>> // add setMarkers if it needs to be passed down
) => {
    console.log("User: ", user);

    if (user === 'buyer') {
        console.log('User does not have permission to add markers.');
        return;
    }

    const latLng = event.latLng;
    if (latLng) {
        const lat = latLng.lat();
        const lng = latLng.lng();

        console.log("Adding marker at:", lat, lng);

        addMarker(lat, lng).then((r) => console.log(r));
        setMarkers((prevMarkers) => [...prevMarkers, {lat, lng}]);
    }
};

export const handleMapDblClick = (
    event: google.maps.MapMouseEvent,
    user: string,
    bermudaTriangle: google.maps.Polygon | null,
    mapRef: React.RefObject<google.maps.Map>
) => {
    const latLng = event.latLng;
    if (!latLng) {
        console.log("No latLng found in event:", event);
        return;
    }

    console.log("Double click at:", latLng.lat(), latLng.lng());
    console.log("User: ", user);

    if (user !== 'buyer') {
        console.log('User does not have permission to double click.');
        return;
    }

    if (bermudaTriangle && google.maps.geometry.poly.containsLocation(latLng, bermudaTriangle)) {
        console.log("Inside the triangle!");
    } else {
        console.log("Outside the triangle!");
    }

    if (bermudaTriangle) {
        const resultColor = google.maps.geometry.poly.containsLocation(
            latLng,
            bermudaTriangle
        )
            ? "blue"
            : "red";
        const resultPath = google.maps.geometry.poly.containsLocation(
            latLng,
            bermudaTriangle
        )
            ? // A triangle.
            "m 0 -1 l 1 2 -2 0 z"
            : google.maps.SymbolPath.CIRCLE;

        new google.maps.Marker({
            position: event.latLng,
            map: mapRef.current,
            icon: {
                path: resultPath,
                fillColor: resultColor,
                fillOpacity: 0.2,
                strokeColor: "white",
                strokeWeight: 0.5,
                scale: 10,
            },
        });
    }
};
