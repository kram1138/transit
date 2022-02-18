<script>
    import { getFavorites } from "$lib/favorites";
    import { requestStops } from "$lib/request";
    import StopList from "$lib/stopList.svelte";
    import { onMount } from "svelte";

    let stops = [];

    onMount(() => (stops = requestStops(getFavorites())));
</script>

<header>
    <nav>
        <a class="button" href="/">Nearby stops</a>
    </nav>
</header>
<main>
    <StopList {stops} />
</main>
