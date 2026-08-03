<script lang="ts">
  import { playUnit } from "./audio";
  import { durationLabel, prettyNoteName } from "./music";
  import OutputSelector from "./OutputSelector.svelte";
  import UnitNotation from "./UnitNotation.svelte";
  import type { Alphabet, SoundUnit } from "./types";

  interface Props {
    alphabet: Alphabet;
    unit: SoundUnit;
    prevUnit: SoundUnit;
    nextUnit: SoundUnit;
  }

  let { alphabet, unit, prevUnit, nextUnit }: Props = $props();

  const categoryLabel = $derived(
    alphabet.categories.find((category) => category.id === unit.category)
      ?.label ?? unit.category,
  );

  let playing = $state(false);

  const handlePlay = async () => {
    playing = true;
    try {
      await playUnit(unit);
    } catch (error) {
      console.error("Failed to play unit:", error);
    }
    // Keep the button highlighted roughly as long as the note sounds
    setTimeout(() => {
      playing = false;
    }, unit.beats * 1000);
  };
</script>

<div class="unit-page">
  <div class="unit-card">
    <p class="category">{categoryLabel}</p>
    <h2 class="symbol">{unit.symbol}</h2>
    {#if unit.example}
      <p class="example">as in «&nbsp;{unit.example}&nbsp;»</p>
    {/if}

    <div class="notation-wrapper">
      <UnitNotation {unit} clef={unit.clef ?? alphabet.clef} />
    </div>

    <div class="unit-info">
      <p>
        <span class="info-label">{unit.rest ? "Rest" : "Note:"}</span>
        {#if !unit.rest}{prettyNoteName(unit.note ?? "")}{/if}
      </p>
      <p>
        <span class="info-label">Duration:</span>
        {durationLabel(unit.beats)} ({unit.duration})
      </p>
    </div>

    <button class="play-button" class:playing onclick={handlePlay}>
      Play <span class="symbol-inline">{unit.symbol}</span>
    </button>

    <OutputSelector />
  </div>

  <div class="pager">
    <a class="pager-link" href="/{alphabet.id}/unit/{prevUnit.slug}">
      ← <span class="symbol-inline">{prevUnit.symbol}</span>
    </a>
    <a class="pager-link index-link" href="/{alphabet.id}">All symbols</a>
    <a class="pager-link" href="/{alphabet.id}/unit/{nextUnit.slug}">
      <span class="symbol-inline">{nextUnit.symbol}</span> →
    </a>
  </div>
</div>

<style>
  .unit-page {
    max-width: 560px;
    margin: 0 auto;
    padding: 16px 0;
  }

  .unit-card {
    background-color: var(--color-paper-strong);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
    padding: 32px 24px;
    box-shadow: var(--shadow-soft);
    text-align: center;
  }

  .category {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: var(--text-xs);
    color: var(--color-muted);
    margin: 0;
  }

  .symbol-inline {
    font-family: var(--font-phonetic);
  }

  .symbol {
    font-family: var(--font-phonetic);
    font-size: 6rem;
    line-height: 1.1;
    font-weight: 600;
    color: var(--color-ink);
    margin: 8px 0 0;
  }

  .example {
    color: var(--color-muted);
    font-size: var(--text-md);
    margin: 4px 0 24px;
    font-style: italic;
  }

  .notation-wrapper {
    margin-bottom: 24px;
  }

  .unit-info {
    color: var(--color-muted);
    font-size: var(--text-md);
    margin-bottom: 8px;
  }

  .unit-info p {
    margin: 4px 0;
  }

  .info-label {
    color: var(--color-muted);
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
    margin-top: 16px;
    cursor: pointer;
  }

  .play-button:hover {
    background-color: #3a3a37;
    transform: translateY(-1px);
  }

  .play-button:active {
    transform: translateY(1px);
  }

  .play-button.playing {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
    animation: pulse 0.5s ease-out;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(47, 95, 151, 0.5);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(47, 95, 151, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(47, 95, 151, 0);
    }
  }

  .pager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    background: var(--color-paper-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.6rem 1rem;
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

  .index-link {
    font-size: 0.95rem;
    color: var(--color-muted);
  }

  @media (max-width: 600px) {
    .symbol {
      font-size: 4.5rem;
    }
  }
</style>
