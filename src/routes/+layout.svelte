<script lang="ts">
  import Header from '$lib/Header.svelte';
  interface Props {
    children?: import('svelte').Snippet;
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
  :global(body) {
    background-color: #f5f5f7;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #1d1d1f;
    line-height: 1.5;
  }
  
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
    font-size: 0.875rem;
    color: #86868b;
  }
  
  @media (max-width: 768px) {
    .app-container {
      padding: 16px 12px;
    }
  }
</style>
