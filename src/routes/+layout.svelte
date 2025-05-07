<script lang="ts">
  import Nav from '$lib/Nav.svelte';
</script>

<main>
  <Nav />
  
  <div class="app-container">
    <slot />
    
    <footer>
      <p>Built with <a href="https://svelte.dev" target="_blank" rel="noreferrer">Svelte</a> and <a href="https://www.vexflow.com" target="_blank" rel="noreferrer">VexFlow</a></p>
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
  
  footer a {
    color: #007AFF;
    text-decoration: none;
  }
  
  footer a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .app-container {
      padding: 16px 12px;
    }
  }
</style>
