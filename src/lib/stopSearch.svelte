<script>
    import { onMount } from "svelte";
    import { requestStopSearch } from "./request";
    import StopList from "$lib/stopList.svelte";

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

<StopList {stops} />

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
</style>
