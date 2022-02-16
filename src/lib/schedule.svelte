<script>
    import Badge from "./badge.svelte";

    export let buses;
</script>

<table>
    {#each buses as { timeLabel, badge, name, late }}
        <tr>
            <td class="badge"><Badge {badge} /></td>
            <td class="route-name">{name}</td>
            <td class="time">{timeLabel}</td>
            <td class="late">{late ? "Late" : "OK"}</td>
        </tr>
    {/each}
</table>

<style>
    table {
        border-spacing: 0;
    }

    tr {
        height: 3.2rem;
    }
    
    td {
        border-bottom: 1px solid var(--border);
    }

    .badge {
        width: 1rem;
    }

    .route-name {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .time {
        white-space: nowrap;
    }
</style>
