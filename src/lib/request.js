const apiKey = "50U7gzbn0offvzJZHoh";
const base = "https://api.winnipegtransit.com";

export function getBadgeForRoute(route) {
    return {
        label: route["badge-label"],
        color: route["badge-style"]["color"],
        backgroundColor: route["badge-style"]["background-color"],
        borderColor: route["badge-style"]["border-color"],
    };
}

function parseStops(stops) {
    return Promise.all(
        stops.map(({ name, key, distances }) => {
            const path = `/v3/routes.json?stop=${key}&usage=long`;
            return fetch(
                `${base}${path}&api-key=${apiKey}`
            ).then(response => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            }).then(({routes}) => ({
                key,
                name,
                badges: routes.sort((a, b) => a.key - b.key).map(getBadgeForRoute),
                distance: distances?.walking
            }));
        })
    );
}

export async function requestStopSearch(search) {
    const url = new URL(`${base}/v3/stops:${search}.json`);
    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("usage", "long");
    const response = await fetch(url.toString())
    if (!response.ok) {
        throw new Error("Request failed");
    }
    return parseStops((await response.json()).stops);
}

export async function requestStopByLocation({latitude, longitude}, distance) {
    const url = new URL(`${base}/v3/stops.json`);
    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("usage", "long");
    url.searchParams.set("lat", latitude);
    url.searchParams.set("lon", longitude);
    url.searchParams.set("distance", Math.min(distance, 1000));
    url.searchParams.set("walking", true);
    const response = await fetch(url.toString())
    if (!response.ok) {
        throw new Error("Request failed");
    }
    return parseStops((await response.json()).stops);
}

export function requestSchedule(stop, fetch, time) {
    const url = new URL(`${base}/v3/stops/${stop}/schedule.json`);
    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("usage", "long");
    if (time) {
        url.searchParams.set("start", time);
    }
    return fetch(url.toString());
}