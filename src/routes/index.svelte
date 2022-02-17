<script>
    import { getLocation } from "$lib/location";
    import { requestStopByLocation } from "$lib/request";
    import StopList from "$lib/stopList.svelte";

    let stops;
    let distance = 500;
    update();

    function update() {
        stops = getLocation()
            .then((coords) => requestStopByLocation(coords, distance))
            .then((stops) => stops.sort((a, b) => a.distance - b.distance));
    }

    let timer;
    const debounce = (event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            update();
        }, 750);
    };
</script>

<header>
    <nav>
        <a class="button" href="/search">Search</a>
    </nav>
</header>

<main class="label-container">
    <h3>Nearby stops</h3>
    <label for="distanceField">Max distance</label>
    <input
        id="distanceField"
        bind:value={distance}
        type="number"
        on:change={debounce}
    />
    <!-- <button class="icon-button" on:click={update}>
        <i class="material-icons"> refresh </i>
    </button> -->
</main>
<StopList {stops} />

<style>
    .label-container {
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--border);
        margin-bottom: 2rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    h3 {
        white-space: nowrap;
        margin: 0;
        margin-right: auto;
    }

    input {
        max-width: 6rem;
        margin-left: 0.5rem;
    }

    label {
        margin: 0;
    }
</style>
