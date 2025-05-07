<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";
  import type { NoteKey } from "./types";

  interface Props {
    activeNote?: NoteKey | null;
    width?: number;
    height?: number;
    showAllNotes?: boolean;
  }

  let {
    activeNote = null,
    width = 400,
    height = 150,
    showAllNotes = false,
  }: Props = $props();

  let container: HTMLDivElement | undefined = $state();
  let renderer: any;
  let context: any;

  const renderNotation = () => {
    if (!container) return;

    // Clear previous content
    container.innerHTML = "";

    // Create renderer
    renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, height);
    context = renderer.getContext();
    context.setFont("Arial", 10);

    // Create a stave with more space at the top
    const stave = new Stave(10, 20, width - 20);
    stave.addClef("treble").setContext(context).draw();

    let notes;
    if (showAllNotes) {
      notes = ["C", "D", "E", "F", "G", "A", "B"].map((note) => {
        const staveNote = new StaveNote({
          keys: [`${note}/4`],
          duration: "q",
        });

        if (activeNote === note) {
          staveNote.setStyle({
            fillStyle: "#007AFF",
            strokeStyle: "#007AFF",
          });
        }

        return staveNote;
      });
    } else if (activeNote) {
      notes = [
        new StaveNote({
          keys: [`${activeNote}/4`],
          duration: "w",
        }).setStyle({
          fillStyle: "#007AFF",
          strokeStyle: "#007AFF",
        }),
      ];
    } else {
      return;
    }

    // Create a voice and add notes
    const voice = new Voice({
      numBeats: showAllNotes ? 7 : 4,
      beatValue: 4,
    });
    voice.addTickables(notes);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], width - 50);
    voice.draw(context, stave);
  };

  // Redraw when activeNote or showAllNotes changes
  $effect(() => {
    // Explicitly list dependencies to watch
    const _ = [activeNote, showAllNotes, width, height, container];

    if (container) {
      renderNotation();
    }
  });

  onMount(() => {
    renderNotation();
  });

  onDestroy(() => {
    if (renderer) {
      renderer.getContext().svg.remove();
    }
  });
</script>

<div class="notation-container" bind:this={container}></div>

<style>
  .notation-container {
    width: 100%;
    overflow-x: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
