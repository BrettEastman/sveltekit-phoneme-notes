<header>
  <a href="/" class="title">Music Cryptogram</a>
</header>

<style>
  header {
    background-color: var(--color-paper-strong);
    border-bottom: 1px solid var(--color-border-soft);
    position: sticky;
    top: 0;
    z-index: 100;
    text-align: center;
    padding: 20px 16px;
  }

  .title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: var(--text-xl);
    text-transform: uppercase;
    letter-spacing: 0.35em;
    color: var(--color-ink);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .title:hover {
    color: var(--color-accent);
  }

  @media (max-width: 768px) {
    header {
      padding: 16px 12px;
    }

    .title {
      font-size: 1rem;
      letter-spacing: 0.25em;
    }
  }
</style>
