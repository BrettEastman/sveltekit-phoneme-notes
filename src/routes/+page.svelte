<script lang="ts">
  import NotationControl from '$lib/NotationControl.svelte';
</script>

<header>
  <h1>Music Notation</h1>
  <p>Select a note to hear how it sounds</p>
</header>

<NotationControl />

<style>
  header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    color: #1d1d1f;
  }
  
  header p {
    font-size: 1.125rem;
    color: #6e6e73;
    margin-top: 8px;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    header p {
      font-size: 1rem;
    }
  }
</style>
