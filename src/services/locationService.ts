// permissions API reference: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API/Using_the_Permissions_API
// code reference: https://github.com/chrisdavidmills/location-finder-permissions-api/blob/gh-pages/scripts/geoMap.js

const geoSettings: PositionOptions = {
    enableHighAccuracy: false,
    // maximumAge: 30000,
    // timeout: 20000,
};

export async function requestUserLocation(): Promise<{ latitude: number; longitude: number }> {
    if (!('geolocation' in navigator)) {
        throw new Error('Geolocation unavailable');
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: parseFloat(position.coords.latitude.toFixed(3)),
                    longitude: parseFloat(position.coords.longitude.toFixed(3)),
                });
            },
            (error) => {
                reject(error);
            },
            geoSettings,
        );
    });
}
