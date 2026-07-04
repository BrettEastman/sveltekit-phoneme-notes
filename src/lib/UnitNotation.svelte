<script lang="ts">
  import {
    Accidental,
    Dot,
    Formatter,
    GraceNote,
    GraceNoteGroup,
    Renderer,
    Stave,
    StaveNote,
    StaveTie,
    Voice
  } from "vexflow";
  import { beatsToNotation, parseNote } from "./music";
  import type { SoundUnit } from "./types";

  interface Props {
    unit: SoundUnit;
    width?: number;
    height?: number;
  }

  let { unit, width = 360, height = 220 }: Props = $props();

  let container: HTMLDivElement | undefined = $state();

  const renderNotation = () => {
    if (!container) return;

    container.innerHTML = "";

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont("Arial", 10);

    // Leave headroom above the stave for ledger-line notes up to A6
    const stave = new Stave(10, 70, width - 20);
    stave.addClef("treble").setContext(context).draw();

    const parsed = parseNote(unit.note);

    // Durations longer than a single notatable value become tied notes
    const notes = beatsToNotation(unit.beats).map(({ vexDuration, dotted }, i) => {
      const staveNote = new StaveNote({
        keys: [parsed.vexKey],
        duration: vexDuration
      });
      if (i === 0 && parsed.accidental) {
        staveNote.addModifier(new Accidental(parsed.accidental));
      }
      if (dotted) {
        Dot.buildAndAttach([staveNote], { all: true });
      }
      return staveNote;
    });

    // Articulation ornament from the score, drawn as a slashed grace note
    if (unit.grace) {
      const grace = new GraceNote({
        keys: [parseNote(unit.grace.note).vexKey],
        duration: "8",
        slash: true
      });
      notes[0].addModifier(new GraceNoteGroup([grace], true));
    }

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.setStrict(false);
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], width - 90);
    voice.draw(context, stave);

    for (let i = 1; i < notes.length; i++) {
      new StaveTie({
        firstNote: notes[i - 1],
        lastNote: notes[i],
        firstIndexes: [0],
        lastIndexes: [0]
      })
        .setContext(context)
        .draw();
    }
  };

  $effect(() => {
    // Explicitly list dependencies to watch
    const _ = [unit, width, height, container];

    if (container) {
      renderNotation();
    }
  });
</script>

<div class="notation-container" bind:this={container}></div>

<style>
  .notation-container {
    width: 100%;
    overflow-x: auto;
    background-color: #ffffff;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
