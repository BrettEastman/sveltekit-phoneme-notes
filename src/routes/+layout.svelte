<script lang="ts">
  import "../styles/tokens.css";
  import "../styles/base.css";
  import Header from "$lib/Header.svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  const currentYear = new Date().getFullYear();
</script>

<main>
  <Header />

  <div class="app-container">
    {@render children?.()}

    <footer>
      <p>© {currentYear} Lost Lanes Publishing</p>
    </footer>
  </div>
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
  }

  .app-container {
    width: 100%;
    max-width: 900px;
    padding: 24px 16px;
    box-sizing: border-box;
    margin: 0 auto;
  }

  footer {
    margin-top: 56px;
    text-align: center;
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  @media (max-width: 768px) {
    .app-container {
      padding: 16px 12px;
    }
  }
</style>
