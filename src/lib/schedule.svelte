<script>
  import Badge from "./badge.svelte";

  export let buses;
</script>

<table>
  {#each buses as { timeLabel, badge, bike, wifi, name, late }}
    <tr>
      <td class="badge"><Badge {badge} /></td>
      <td>
        <div class="route-name">
          <span>{name}</span>
          {#if bike}
            <i class="material-icons bus-option">directions_bike</i>
          {/if}
          {#if wifi}<i class="material-icons bus-option">wifi</i>{/if}
        </div>
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
    height: 3.2rem;
  }

  td {
    border-bottom: 1px solid var(--border);
  }

  .badge {
    width: 1rem;
  }

  .bus-option {
    padding-left: 0.5rem;
  }

  .route-name {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    align-items: center;
    display: flex;
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
