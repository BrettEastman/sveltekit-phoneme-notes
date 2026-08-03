<script lang="ts">
  import { onMount } from "svelte";
  import { midiSupported } from "./midi";
  import {
    enableMidi,
    outputState,
    restoreMidiIfGranted,
    selectOutput,
    SYNTH_OUTPUT,
  } from "./output.svelte";

  let enabling = $state(false);
  let error: string | null = $state(null);

  onMount(() => {
    restoreMidiIfGranted();
  });

  const handleEnable = async () => {
    enabling = true;
    error = null;
    try {
      await enableMidi();
    } catch {
      error = "MIDI access was blocked — check the site permissions.";
    }
    enabling = false;
  };
</script>

{#if midiSupported()}
  <div class="output-selector">
    {#if outputState.midiReady}
      <label>
        Output
        <select
          value={outputState.selectedId}
          onchange={(event) => selectOutput(event.currentTarget.value)}
        >
          <option value={SYNTH_OUTPUT}>Sine tone</option>
          {#each outputState.outputs as output (output.id)}
            <option value={output.id}>{output.name}</option>
          {/each}
        </select>
      </label>
      {#if outputState.outputs.length === 0}
        <span class="note">No MIDI devices found</span>
      {/if}
    {:else}
      <button
        type="button"
        class="enable"
        onclick={handleEnable}
        disabled={enabling}
      >
        {enabling ? "Connecting…" : "Use MIDI output…"}
      </button>
      {#if error}
        <span class="note">{error}</span>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .output-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: 12px;
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  label {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  select {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background: #fff;
    color: var(--color-ink);
    font-size: var(--text-sm);
    padding: 0.25rem 0.75rem;
    cursor: pointer;
  }

  select:focus-visible {
    outline: 2px solid var(--color-accent-soft);
    outline-offset: 2px;
  }

  .enable {
    background: none;
    border: none;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    color: var(--color-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .enable:hover:enabled {
    color: var(--color-ink);
  }

  .enable:disabled {
    cursor: wait;
  }

  .note {
    font-size: var(--text-xs);
  }
</style>
