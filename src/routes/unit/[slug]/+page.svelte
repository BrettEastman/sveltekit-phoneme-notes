<script lang="ts">
  import UnitPage from '$lib/UnitPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<UnitPage unit={data.unit} prevUnit={data.prevUnit} nextUnit={data.nextUnit} />
