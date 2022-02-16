<script>
    import { onMount } from "svelte";

    import Badge from "./badge.svelte";
    import { requestStopSearch } from "./request";

    let search = "";
    $: stops = search?.length
        ? requestStopSearch(search)
        : Promise.resolve(null);

    let timer;
    let input;

    onMount(() => {
        input.focus();
    });

    const debounce = (event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            search = event.target.value;
        }, 750);
    };
</script>

<p class="search">
    <label for="stopSearch">Search for stop</label>
    <input bind:this={input} id="stopSearch" on:input={debounce} />
    <i class="material-icons">search</i>
</p>

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
                                <div>{stop.name}</div>
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
    .search {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        position: relative;
    }

    i {
        position: absolute;
        top: 2.5rem;
        right: 0.5rem;
        pointer-events: none;
    }

    .stop {
        display: flex;
        flex-direction: column;
        align-items: start;
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
