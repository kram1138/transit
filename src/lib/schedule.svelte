<script>
  import Badge from "./badge.svelte";

  export let buses;
</script>

<table>
  {#each buses as { timeLabel, badge, bike, wifi, route, destination, late }}
    <tr>
      <td class="badge"><Badge {badge} /></td>
      <td>
        <div class="route-info">
          <span class="route">{route}</span>
          <span class="destination">{destination}</span>
        </div>
      </td>
      <td>
        {#if bike}
          <i class="material-icons bus-option">directions_bike</i>
        {/if}
        {#if wifi}<i class="material-icons bus-option">wifi</i>{/if}
      </td>
      <td><span class="time" class:late>{timeLabel}</span></td>
    </tr>
  {/each}
</table>

<style>
  table {
    border-spacing: 0;
  }

  tr {
    height: 3.8rem;
  }

  td {
    border-bottom: 1px solid var(--border);
  }

  .badge {
    width: 1rem;
  }

  .bus-option {
    padding-right: 0.5rem;
  }

  .route-info {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .route {
    margin-bottom: 0.25rem;
  }

  .destination {
    font-size: var(--font-size-small);
  }

  .time {
    white-space: nowrap;
    border-radius: 4px;
    padding: 0.2rem;
  }

  .late {
    border: 2px solid var(--late);
  }
</style>
