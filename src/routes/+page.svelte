<script lang="ts">
  import { alphabets } from "$lib/data/alphabets";
</script>

<svelte:head>
  <title>Cryptogramme Phonétique — Alphabets</title>
</svelte:head>

<header>
  <p>
    A musical cryptogram: a composition system that maps each sound of a
    language to a specific musical pitch and duration, so text can be
    transcribed into music. Pick an alphabet to explore its sounds — or type
    words and hear them as melodies.
  </p>
</header>

<div class="alphabet-grid">
  {#each alphabets as alphabet (alphabet.id)}
    <a class="alphabet-card" href="/{alphabet.id}">
      <h2>{alphabet.name}</h2>
      <p class="card-description">{alphabet.description}</p>
      <p class="card-meta">
        {alphabet.units.length} units · {alphabet.clef} clef
        <span class="card-arrow">→</span>
      </p>
    </a>
  {/each}
</div>

<style>
  header {
    text-align: center;
    margin-bottom: 32px;
  }

  header p {
    font-size: var(--text-lg);
    color: var(--color-muted);
    margin: 8px auto 0;
    max-width: 640px;
  }

  .alphabet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-4);
  }

  .alphabet-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background-color: var(--color-paper-strong);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }

  .alphabet-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .alphabet-card h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-ink);
  }

  .card-description {
    color: var(--color-muted);
    font-size: var(--text-sm);
    margin: 0;
    flex: 1;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-muted);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;
  }

  .card-arrow {
    color: var(--color-accent);
    font-size: var(--text-lg);
  }
</style>
