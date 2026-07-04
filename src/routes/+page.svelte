<script lang="ts">
  import { categoryLabels, categoryOrder, units } from "$lib/data/units";
  import { prettyNoteName } from "$lib/music";
</script>

<header>
  <p>
    A musical cryptogram: a composition system that maps each sound of a
    language to a specific musical pitch and duration. This current iteration is
    an index of French phonemes (37 sounds) for transcribing French into music.
  </p>
</header>

{#each categoryOrder as category}
  <section>
    <h2>{categoryLabels[category]}</h2>
    <div class="unit-grid">
      {#each units.filter((unit) => unit.category === category) as unit}
        <a class="unit-tile" href="/unit/{unit.slug}">
          <span class="tile-symbol">{unit.symbol}</span>
          <span class="tile-note"
            >{prettyNoteName(unit.note)} · {unit.duration}</span
          >
        </a>
      {/each}
    </div>
  </section>
{/each}

<style>
  header {
    text-align: left;
    margin-bottom: 25px;
    padding-inline: 8px;
  }

  header p {
    font-size: var(--text-lg);
    color: var(--color-muted);
    margin-top: 8px;
  }

  section {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 1.35rem;
    color: var(--color-ink);
    font-weight: 600;
    margin: 0 0 12px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 6px;
  }

  .unit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    gap: 12px;
  }

  .unit-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: var(--color-paper-strong);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 16px 8px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .unit-tile:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .tile-symbol {
    font-family: var(--font-phonetic);
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-ink);
  }

  .tile-note {
    font-size: var(--text-xs);
    color: var(--color-muted);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    header p {
      font-size: 1rem;
    }

    .unit-grid {
      grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
      gap: 8px;
    }
  }
</style>
