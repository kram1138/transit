<script context="module">
    import { requestSchedule, getBadgeForRoute } from "$lib/request";
    import { onMount } from "svelte";

    function getSchedule(response) {
        const routeSchedules = response["stop-schedule"]["route-schedules"];
        const now = new Date();
        const formatRelative = new Intl.RelativeTimeFormat("en-CA", {
            style: "short",
        });
        const formatTime = new Intl.DateTimeFormat("en-CA", {
            hour: "2-digit",
            minute: "2-digit",
        });
        /** @type { {
         * name: string,
         * time: Date,
         * timeLabel: string,
         * badge: unknown,
         * late: boolean,
         * }[] }*/
        const buses = routeSchedules.flatMap((route) => {
            const badge = getBadgeForRoute(route.route);
            return route["scheduled-stops"].map((stop) => {
                const time = new Date(stop.times.departure.estimated);
                const delta = (time - now) / 1000 / 60;
                const timeLabel =
                    delta < 15
                        ? formatRelative.format(Math.ceil(delta), "minute")
                        : formatTime.format(time);
                const minsPastScheduled =
                    (time - new Date(stop.times.departure.scheduled)) /
                    1000 /
                    60;
                const late = minsPastScheduled > 1;
                return {
                    time,
                    timeLabel,
                    name: stop.variant.name,
                    badge,
                    late,
                };
            });
        });
        return {
            schedule: buses.sort((a, b) => a.time - b.time),
            name: response["stop-schedule"].stop.name,
        };
    }

    /** @type {import('@sveltejs/kit').Load} */
    export async function load({ params, url, fetch }) {
        const time = url.searchParams.get("time");
        const response = await requestSchedule(params.key, fetch, time);
        return {
            status: response.status,
            props: {
                stop: response.ok && getSchedule(await response.json(), fetch),
                time,
            },
        };
    }
</script>

<script>
    import { goto } from "$app/navigation";
    import Schedule from "../../lib/schedule.svelte";
    export let stop;
    export let time;
    let expanded = false;
    let timeInput;

    function updateWithTime(time) {
        const url = new URL(window.location.href);
        if (time) {
            url.searchParams.set("time", time);
        } else {
            url.searchParams.delete("time");
        }
        goto(url);
    }

    onMount(() => {
        if (time) {
            expanded = true;
        }
    });

    $: if (expanded) {
        setTimeout(() => (timeInput.value = time));
    }
</script>

<div class="stop">
    {#await stop}
        Loading
    {:then stop}
        <div class="stop-label">
            <div class="always-open">
                {stop.name}
                <button
                    class="icon-button"
                    on:click={() => (expanded = !expanded)}
                >
                    <i
                        class="material-icons expand-icon"
                        class:icon-expanded={expanded}>expand_more</i
                    >
                </button>
            </div>
            {#if expanded}
                <p class="expanded">
                    <label for="select-time">Time</label>
                    <span class="time-input">
                        <input
                            bind:this={timeInput}
                            type="datetime-local"
                            id="select-time"
                            on:change={(event) =>
                                updateWithTime(event.target.value)}
                        />
                        <button on:click={() => updateWithTime()}>Now</button>
                    </span>
                </p>
            {/if}
        </div>
        <Schedule buses={stop.schedule} />
    {:catch}
        No route found
    {/await}
</div>

<style>
    .stop {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .stop-label {
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--border);
        margin-bottom: 2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .always-open {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .expand-icon {
        transition: transform 0.3s;
    }

    .icon-expanded {
        transform: rotate(180deg);
    }

    .expanded {
        display: flex;
        flex-direction: column;
    }

    .time-input {
        display: flex;
    }
</style>
