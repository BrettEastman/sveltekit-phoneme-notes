<script lang="ts">
  import { onMount } from 'svelte';
  import NoteButton from './NoteButton.svelte';
  import NotationRenderer from './NotationRenderer.svelte';
  import { playNote, initAudio } from './audio';
  import { noteData, noteKeys } from './notes';
  import type { NoteKey } from './types';
  
  let activeNote: NoteKey | null = null;
  let audioInitialized = false;
  
  onMount(async () => {
    try {
      await initAudio();
      audioInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  });
  
  const handleNoteSelect = (event: CustomEvent) => {
    const note = event.detail;
    activeNote = note.name as NoteKey;
    
    if (audioInitialized) {
      playNote(note.fullName);
      
      // Reset active note after animation duration
      setTimeout(() => {
        activeNote = null;
      }, 1000);
    }
  };
  
  const initializeAudio = async () => {
    if (!audioInitialized) {
      try {
        await initAudio();
        audioInitialized = true;
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  };
</script>

<div class="notation-control">
  <div class="notation-wrapper">
    <NotationRenderer activeNote={activeNote} showAllNotes={true} />
  </div>
  
  {#if !audioInitialized}
    <div class="audio-init">
      <p>Audio requires user interaction to initialize</p>
      <button class="init-button" on:click={initializeAudio}>
        Initialize Audio
      </button>
    </div>
  {/if}
  
  <div class="note-buttons">
    {#each noteKeys as key}
      <NoteButton 
        note={noteData[key]} 
        active={activeNote === key} 
        on:select={handleNoteSelect} 
      />
    {/each}
  </div>
</div>

<style>
  .notation-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .notation-wrapper {
    width: 100%;
    margin-bottom: 24px;
  }
  
  .note-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
  }
  
  .audio-init {
    background-color: #fff3cd;
    color: #856404;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    text-align: center;
    width: 100%;
  }
  
  .init-button {
    background-color: #007AFF;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
  }
  
  @media (max-width: 600px) {
    .note-buttons {
      gap: 8px;
    }
  }
</style>
