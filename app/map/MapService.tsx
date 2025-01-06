export class MapService {
    static mapRef: google.maps.Map | null = null;
    static placesServiceRef: google.maps.places.PlacesService | null = null;
    static isLoaded: boolean = false;

    static setMap(map: google.maps.Map) {
        this.mapRef = map;
        this.placesServiceRef = new google.maps.places.PlacesService(map);
    }

    static getMap() {
        return this.mapRef;
    }

    static getPlacesService() {
        return this.placesServiceRef;
    }

    static setIsLoaded(loaded: boolean) {
        this.isLoaded = loaded;
    }
}