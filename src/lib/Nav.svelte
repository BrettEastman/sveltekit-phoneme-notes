<script lang="ts">
  import { page } from '$app/stores';
  import { noteKeys } from './notes';
  
  // Derive the active note from the current route
  $: activeNote = $page.params.noteKey;
</script>

<nav>
  <div class="nav-container">
    <a href="/" class="nav-link" class:active={!activeNote}>Home</a>
    {#each noteKeys as note}
      <a 
        href="/note/{note}" 
        class="nav-link" 
        class:active={activeNote === note}
      >
        Note {note}
      </a>
    {/each}
  </div>
</nav>

<style>
  nav {
    background-color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nav-link {
    padding: 16px 20px;
    color: #6e6e73;
    text-decoration: none;
    font-weight: 500;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: #007AFF;
    text-decoration: none;
  }

  .nav-link.active {
    color: #007AFF;
    border-bottom-color: #007AFF;
  }

  @media (max-width: 768px) {
    .nav-link {
      padding: 12px 16px;
      font-size: 0.9rem;
    }
  }
</style>
