<script lang="ts">
  import { playMelody } from "$lib/audio";
  import MelodyNotation from "$lib/MelodyNotation.svelte";
  import OutputSelector from "$lib/OutputSelector.svelte";
  import { tokenize } from "$lib/tokenize";
  import type { SoundUnit } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let word = $state("");
  let playing = $state(false);

  const alphabet = $derived(data.alphabet);
  const result = $derived(tokenize(alphabet, word));
  const melodyUnits = $derived(
    result.matches
      .map((match) => match.unit)
      .filter((unit): unit is SoundUnit => unit !== null),
  );

  const emptyHint = $derived(
    alphabet.kind === "phoneme"
      ? "One French word, letters only. Accents welcome."
      : alphabet.units.some((unit) => unit.slug === "space")
        ? "Words, phrases, punctuation — spaces and punctuation become rests."
        : "Any word — letters A to Z.",
  );

  const handlePlay = async () => {
    if (melodyUnits.length === 0 || playing) return;
    playing = true;
    try {
      const totalSeconds = await playMelody(melodyUnits);
      setTimeout(() => {
        playing = false;
      }, totalSeconds * 1000);
    } catch (error) {
      console.error("Failed to play melody:", error);
      playing = false;
    }
  };
</script>

<svelte:head>
  <title>Word Melody — {alphabet.name}</title>
</svelte:head>

<div class="melody-page">
  <header>
    <h3>Enter text to hear it as a melody</h3>
  </header>

  <div class="melody-card">
    <form
      class="word-form"
      onsubmit={(event) => {
        event.preventDefault();
        handlePlay();
      }}
    >
      <input
        type="text"
        placeholder={alphabet.kind === "phoneme"
          ? "one word in French"
          : "word or phrase in English"}
        maxlength={alphabet.kind === "phoneme" ? 24 : 80}
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        aria-label="Text to play"
        bind:value={word}
      />
      <button
        type="submit"
        class="play-button"
        class:playing
        disabled={melodyUnits.length === 0}
      >
        Play
      </button>
    </form>

    <OutputSelector />

    {#if result.error}
      <p class="hint error">{result.error}</p>
    {:else if melodyUnits.length > 0}
      <p class="readout" aria-label="Units">
        {#each melodyUnits as unit, i (i)}
          <a class="phoneme" href="/{alphabet.id}/unit/{unit.slug}"
            >{unit.symbol}</a
          >
        {/each}
      </p>

      <div class="notation-wrapper">
        <MelodyNotation units={melodyUnits} clef={alphabet.clef} />
      </div>

      {#if alphabet.kind === "phoneme"}
        <p class="hint">
          Read by simple spelling rules. Some words won't be perfect.
        </p>
      {/if}
    {:else}
      <p class="hint">{emptyHint}</p>
    {/if}
  </div>

  <div class="pager">
    <a class="pager-link" href="/{alphabet.id}">← All of {alphabet.name}</a>
  </div>
</div>

<style>
  .melody-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 16px 0;
  }

  header {
    text-align: center;
    margin-bottom: 24px;
  }

  header h1 {
    font-size: 2rem;
    margin: 0 0 4px;
    color: var(--color-ink);
  }

  header p {
    color: var(--color-muted);
    font-size: var(--text-md);
    margin: 0;
  }

  .melody-card {
    background-color: var(--color-paper-strong);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-soft);
    text-align: center;
  }

  .word-form {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  input {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background: #fff;
    color: var(--color-ink);
    padding: 0.55rem 1.2rem;
    font-size: var(--text-lg);
    width: min(280px, 100%);
  }

  input:focus-visible {
    outline: 2px solid var(--color-accent-soft);
    outline-offset: 2px;
  }

  .play-button {
    background-color: var(--color-ink);
    color: #fff;
    padding: 0.55rem 1.5rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-ink);
    font-weight: 600;
    font-size: var(--text-md);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .play-button:hover:enabled {
    background-color: #3a3a37;
    transform: translateY(-1px);
  }

  .play-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .play-button.playing {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .readout {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin: 20px 0 16px;
  }

  .phoneme {
    font-family: var(--font-phonetic);
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-ink);
    text-decoration: none;
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 2px 10px;
    transition: border-color 0.2s ease;
  }

  .phoneme:hover {
    border-color: var(--color-accent);
  }

  .notation-wrapper {
    margin-top: 4px;
  }

  .hint {
    color: var(--color-muted);
    font-size: var(--text-sm);
    margin: 16px 0 0;
  }

  .hint.error {
    color: #8d3535;
  }

  .pager {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .pager-link {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--text-md);
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    transition: background-color 0.2s ease;
  }

  .pager-link:hover {
    background-color: var(--color-border-soft);
  }
</style>
