export function getFavorites() {
    return localStorage
        .getItem("favorites")
        ?.split(",")
        ?.filter((stop) => stop.length)
        ?.map(stop => Number(stop)) ?? [];
}

export function toggleFavorite(favorites, stop) {
    const newList = favorites.includes(stop)
        ? favorites.filter((key) => key !== stop)
        : [...favorites, stop];

    localStorage.setItem("favorites", newList);
    return newList;
}