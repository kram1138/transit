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
        stops.map(({ name, key, distances, centre, direction }) => {
            const path = `/v3/routes.json?stop=${key}&usage=long`;
            const coords = `${centre.geographic.latitude},${centre.geographic.longitude}`;
            const mapApiKey = "ZL3bTGp45fNVvABIQcZPsqiRQzGoaiUA";
            const directionSymbol = direction[0];
            const url = new URL(`https://open.mapquestapi.com/staticmap/v5/map`);
            url.searchParams.append("key", mapApiKey);
            url.searchParams.append("center", coords);
            url.searchParams.append("locations", `${coords}|marker-${directionSymbol}`);
            url.searchParams.append("size", "170,170");
            url.searchParams.append("zoom", 15);
            return fetch(
                `${base}${path}&api-key=${apiKey}`
            ).then(response => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            }).then(({ routes }) => ({
                key,
                name,
                badges: routes.sort((a, b) => a.key - b.key).map(getBadgeForRoute),
                distance: distances?.walking,
                src: url.href.replace(/%2C/g, ",").replace(/%7C/g, "|")
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

export async function requestStopByLocation({ latitude, longitude }, distance) {
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

export async function requestStops(stops) {
    const responses = await Promise.all(stops.map(stop => {
        const url = new URL(`${base}/v3/stops/${stop}.json`);
        url.searchParams.set("api-key", apiKey);
        return fetch(url.toString()).then(response => {
            if (!response.ok) {
                throw new Error("Request failed");
            }
            return response.json();
        }).then(body => body.stop);
    }));
    return parseStops(await responses);
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