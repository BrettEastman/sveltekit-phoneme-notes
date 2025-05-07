<script lang="ts">
  import NotePage from '$lib/NotePage.svelte';
  import type { NoteKey } from '$lib/types';
  import { page } from '$app/stores';
  
  // Get the note key from the URL parameters
  $: noteKey = $page.params.noteKey as NoteKey;
</script>

<NotePage noteName={noteKey} />
