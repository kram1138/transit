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

export async function requestStopSearch(search) {
    const path = `/v3/stops:${search}.json`;
    const response = await fetch(
        `${base}${path}?api-key=${apiKey}&usage=long`
    )
    if (!response.ok) {
        throw new Error("Request failed");
    }
    const stops = (await response.json()).stops;
    const withBadges = await Promise.all(
        stops.map(({ name, key }) => {
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
                badges: routes.sort((a, b) => a.key - b.key).map(getBadgeForRoute)
            }));
        })
    );
    return withBadges;
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