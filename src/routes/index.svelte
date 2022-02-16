<script>
    import { getLocation } from "$lib/location";
    import { requestStopByLocation } from "$lib/request";
    import StopList from "$lib/stopList.svelte";

    let stops;
    update();

    function update() {
        stops = getLocation().then(requestStopByLocation).then(stops => stops.sort((a, b) => a.distance - b.distance));
    }
</script>

<h3>
    <span>Nearby stops</span>
    <button class="icon-button" on:click={update}>
        <i class="material-icons"> refresh </i>
    </button>
</h3>
<StopList {stops} />

<style>
    h3 {
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--border);
        margin-bottom: 2rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
    }
</style>
