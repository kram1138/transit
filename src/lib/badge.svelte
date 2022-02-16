<script>
    export let badge;
</script>

<div
    class="badge"
    style="
            background-color: {badge.backgroundColor};
            border-color: {badge.borderColor};
            color: {badge.color}
        "
>
    {badge.label}
</div>

<style>
    .badge {
        padding: 4px;
        border: 1px solid;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
        border-radius: 0.25rem;
    }

    .badge:not(:last-child) {
        margin-right: 0.5rem;
    }
</style>
