<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Note } from './types';
  
  interface Props {
    note: Note;
    active?: boolean;
  }

  let { note, active = false }: Props = $props();
  
  const dispatch = createEventDispatcher();
  
  const handleClick = () => {
    dispatch('select', note);
  };
  
  let buttonClass = $derived(active ? 'note-button active' : 'note-button');
</script>

<button 
  class={buttonClass}
  onclick={handleClick}
  aria-label={`Play note ${note.name}`}
>
  {note.name}
</button>

<style>
  .note-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #f2f2f7;
    border: 2px solid #d1d1d6;
    color: #1c1c1e;
    font-size: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0 8px;
    user-select: none;
  }
  
  .note-button:hover {
    background-color: #e5e5ea;
    transform: translateY(-2px);
  }
  
  .note-button:active {
    transform: translateY(1px);
  }
  
  .note-button.active {
    background-color: #007AFF;
    border-color: #007AFF;
    color: white;
    animation: pulse 0.5s ease-out;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.6);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
    }
  }
  
  @media (max-width: 600px) {
    .note-button {
      width: 48px;
      height: 48px;
      font-size: 1rem;
      margin: 0 4px;
    }
  }
</style>
