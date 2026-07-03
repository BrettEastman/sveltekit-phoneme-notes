<script lang="ts">
  import { categoryLabels, categoryOrder, units } from '$lib/data/units';
  import { prettyNoteName } from '$lib/music';
</script>

<header>
  <p>A music cryptogram — every sound has a note. Select one to explore it.</p>
</header>

{#each categoryOrder as category}
  <section>
    <h2>{categoryLabels[category]}</h2>
    <div class="unit-grid">
      {#each units.filter((unit) => unit.category === category) as unit}
        <a class="unit-tile" href="/unit/{unit.slug}">
          <span class="tile-symbol">{unit.symbol}</span>
          <span class="tile-note">{prettyNoteName(unit.note)} · {unit.duration}</span>
        </a>
      {/each}
    </div>
  </section>
{/each}

<style>
  header {
    text-align: center;
    margin-bottom: 40px;
  }

  header p {
    font-size: 1.125rem;
    color: #6e6e73;
    margin-top: 8px;
  }

  section {
    margin-bottom: 32px;
  }

  h2 {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #86868b;
    font-weight: 600;
    margin: 0 0 12px;
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
    background-color: #ffffff;
    border: 2px solid #d1d1d6;
    border-radius: 12px;
    padding: 16px 8px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .unit-tile:hover {
    border-color: #007aff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .tile-symbol {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1d1d1f;
  }

  .tile-note {
    font-size: 0.8rem;
    color: #6e6e73;
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
