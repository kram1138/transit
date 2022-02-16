export function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position.coords),
            e => {
                console.log(e);
                reject(e);
            }
        )
    });
}