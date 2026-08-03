<script lang="ts">
  import { prettyNoteName } from "$lib/music";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const alphabet = $derived(data.alphabet);
</script>

<svelte:head>
  <title>{alphabet.name} — Cryptogramme Phonétique</title>
</svelte:head>

<header>
  <h1>{alphabet.name}</h1>
  <p>{@html alphabet.description}</p>
  <a class="melody-cta" href="/{alphabet.id}/melody"
    >Turn a word into a melody →</a
  >
</header>

{#each alphabet.categories as category (category.id)}
  <section>
    <h2>{category.label}</h2>
    <div class="unit-grid">
      {#each alphabet.units.filter((unit) => unit.category === category.id) as unit (unit.slug)}
        <a class="unit-tile" href="/{alphabet.id}/unit/{unit.slug}">
          <span class="tile-symbol">{unit.symbol}</span>
          <span class="tile-note">
            {unit.rest ? "rest" : prettyNoteName(unit.note ?? "")} · {unit.duration}
          </span>
        </a>
      {/each}
    </div>
  </section>
{/each}

<div class="back-link-row">
  <a class="back-link" href="/">← All alphabets</a>
</div>

<style>
  header {
    text-align: center;
    margin-bottom: 40px;
  }

  header h1 {
    font-size: 2rem;
    margin: 0 0 4px;
    color: var(--color-ink);
  }

  header p {
    font-size: var(--text-md);
    color: var(--color-muted);
    margin: 4px auto 0;
    max-width: 620px;
  }

  header p :global(a) {
    color: var(--color-muted);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s ease;
  }

  header p :global(a:hover) {
    color: var(--color-accent);
  }

  .melody-cta {
    display: inline-block;
    margin-top: 16px;
    padding: 0.55rem 1.2rem;
    background-color: var(--color-paper-strong);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-ink);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .melody-cta:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
    box-shadow: var(--shadow-soft);
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

  .back-link-row {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  .back-link {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    transition: background-color 0.2s ease;
  }

  .back-link:hover {
    background-color: var(--color-border-soft);
  }

  @media (max-width: 768px) {
    .unit-grid {
      grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
      gap: 8px;
    }
  }
</style>
