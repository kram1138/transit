<script>
    import { getFavorites, toggleFavorite } from "$lib/favorites";
    import { onMount } from "svelte";
    import Badge from "./badge.svelte";

    export let stops;
    let favorites = [];

    onMount(() => (favorites = getFavorites()));

    function updateFavorite(stop) {
        favorites = toggleFavorite(favorites, stop);
    }
</script>

<div class="stop">
    {#await stops}
        Loading
    {:then stops}
        {#if stops}
            {#if stops.length}
                <ul>
                    {#each stops as stop}
                        <li>
                            <a href={`stop/${stop.key}`}>
                                <img src={stop.src} />
                                <div class="stop-info">
                                    <div class="name-distance">
                                        {stop.name}
                                        {#if stop.distance}
                                            <span>
                                                <i class="material-icons">
                                                    directions_walk
                                                </i>
                                                {Math.floor(stop.distance)}m
                                            </span>
                                        {/if}
                                    </div>
                                    <div class="badges">
                                        {#each stop.badges as badge}
                                            <Badge {badge} />
                                        {/each}
                                    </div>
                                </div>
                            </a>
                            <button
                                class="icon-button favorite"
                                on:click={() => updateFavorite(stop.key)}
                            >
                                <i class="material-icons">
                                    {favorites.includes(stop.key)
                                        ? "star"
                                        : "star_border"}
                                </i>
                            </button>
                        </li>
                    {/each}
                </ul>
            {:else}
                No stops found
            {/if}
        {/if}
    {:catch}
        Error getting stops
    {/await}
</div>

<style>
    .stop {
        display: flex;
        flex-direction: column;
        align-items: start;
    }

    .stop-info {
        flex: 1;
    }

    .name-distance {
        display: flex;
        justify-content: space-between;
    }

    .badges {
        display: flex;
        margin-top: 0.25rem;
        margin-right: 2rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    a {
        display: flex;
        align-items: center;
    }

    img {
        height: 6rem;
        margin-right: 1rem;
    }

    ul {
        margin: 0;
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
    }

    li {
        display: flex;
        position: relative;
    }

    a {
        padding: 0.5rem;
        text-decoration: none;
        color: black;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid var(--border);
    }

    a:hover {
        background-color: var(--hover);
    }

    .favorite {
        position: absolute;
        right: 0.5rem;
        bottom: 0.5rem;
    }
</style>
