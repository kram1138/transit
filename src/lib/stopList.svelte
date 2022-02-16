<script>
    import Badge from "./badge.svelte";
    export let stops;
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
                            </a>
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

    .name-distance {
        display: flex;
        justify-content: space-between;
    }

    .badges {
        display: flex;
        margin-top: 0.25rem;
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
</style>
