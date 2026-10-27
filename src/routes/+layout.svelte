<script lang="ts">
  import "../styles/tokens.css";
  import "../styles/base.css";
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<main>
  <Header />

  <div class="app-container">
    {@render children?.()}
  </div>

  <Footer />
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

  @media (max-width: 768px) {
    .app-container {
      padding: 16px 12px;
    }
  }
</style>
