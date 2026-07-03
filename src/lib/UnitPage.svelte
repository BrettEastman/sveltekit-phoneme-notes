<script lang="ts">
  import { playUnit } from "./audio";
  import { categoryLabels } from "./data/units";
  import { durationLabel, prettyNoteName } from "./music";
  import UnitNotation from "./UnitNotation.svelte";
  import type { SoundUnit } from "./types";

  interface Props {
    unit: SoundUnit;
    prevUnit: SoundUnit;
    nextUnit: SoundUnit;
  }

  let { unit, prevUnit, nextUnit }: Props = $props();

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
    <p class="category">{categoryLabels[unit.category]}</p>
    <h2 class="symbol">{unit.symbol}</h2>
    <p class="example">as in «&nbsp;{unit.example}&nbsp;»</p>

    <div class="notation-wrapper">
      <UnitNotation {unit} />
    </div>

    <div class="unit-info">
      <p>
        <span class="info-label">Note:</span>
        {prettyNoteName(unit.note)}
      </p>
      <p>
        <span class="info-label">Duration:</span>
        {durationLabel(unit.beats)} ({unit.duration})
      </p>
    </div>

    <button class="play-button" class:playing onclick={handlePlay}>
      Play {unit.symbol}
    </button>
  </div>

  <div class="pager">
    <a class="pager-link" href="/unit/{prevUnit.slug}">
      ← {prevUnit.symbol}
    </a>
    <a class="pager-link index-link" href="/">All sounds</a>
    <a class="pager-link" href="/unit/{nextUnit.slug}">
      {nextUnit.symbol} →
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
    background-color: #ffffff;
    border-radius: 12px;
    padding: 32px 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .category {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.8rem;
    color: #86868b;
    margin: 0;
  }

  .symbol {
    font-size: 6rem;
    line-height: 1.1;
    font-weight: 600;
    color: #1d1d1f;
    margin: 8px 0 0;
  }

  .example {
    color: #6e6e73;
    font-size: 1.05rem;
    margin: 4px 0 24px;
    font-style: italic;
  }

  .notation-wrapper {
    margin-bottom: 24px;
  }

  .unit-info {
    color: #6e6e73;
    font-size: 1.05rem;
    margin-bottom: 8px;
  }

  .unit-info p {
    margin: 4px 0;
  }

  .info-label {
    color: #86868b;
  }

  .play-button {
    background-color: #007aff;
    color: white;
    padding: 12px 32px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    margin-top: 16px;
    cursor: pointer;
  }

  .play-button:hover {
    background-color: #0062cc;
    transform: translateY(-1px);
  }

  .play-button:active {
    transform: translateY(1px);
  }

  .play-button.playing {
    background-color: #0051a8;
    animation: pulse 0.5s ease-out;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.6);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
    }
  }

  .pager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
  }

  .pager-link {
    color: #007aff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }

  .pager-link:hover {
    background-color: #e5e5ea;
  }

  .index-link {
    font-size: 0.95rem;
    color: #6e6e73;
  }

  @media (max-width: 600px) {
    .symbol {
      font-size: 4.5rem;
    }
  }
</style>
