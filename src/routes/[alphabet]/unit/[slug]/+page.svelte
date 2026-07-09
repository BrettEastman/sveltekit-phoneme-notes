<script lang="ts">
  import UnitPage from '$lib/UnitPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.unit.symbol} — {data.alphabet.name}</title>
</svelte:head>

<UnitPage
  alphabet={data.alphabet}
  unit={data.unit}
  prevUnit={data.prevUnit}
  nextUnit={data.nextUnit}
/>
