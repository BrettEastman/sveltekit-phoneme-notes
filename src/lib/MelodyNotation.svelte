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
    units: SoundUnit[];
    height?: number;
  }

  let { units, height = 220 }: Props = $props();

  let container: HTMLDivElement | undefined = $state();

  const renderNotation = () => {
    if (!container) return;

    container.innerHTML = "";
    if (units.length === 0) return;

    const allNotes: StaveNote[] = [];
    // Pairs of indexes into allNotes to tie (notes within one unit)
    const ties: Array<[number, number]> = [];

    for (const unit of units) {
      const parsed = parseNote(unit.note);
      const firstIndex = allNotes.length;

      beatsToNotation(unit.beats).forEach(({ vexDuration, dotted }, i) => {
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
        if (i > 0) {
          ties.push([allNotes.length - 1, allNotes.length]);
        }
        allNotes.push(staveNote);
      });

      if (unit.grace) {
        const grace = new GraceNote({
          keys: [parseNote(unit.grace.note).vexKey],
          duration: "8",
          slash: true
        });
        allNotes[firstIndex].addModifier(new GraceNoteGroup([grace], true));
      }
    }

    // Scale the stave with the melody length; the container scrolls
    const width = Math.max(360, 120 + allNotes.length * 70);

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont("Arial", 10);

    // Leave headroom above the stave for ledger-line notes up to A6
    const stave = new Stave(10, 70, width - 20);
    stave.addClef("treble").setContext(context).draw();

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.setStrict(false);
    voice.addTickables(allNotes);

    new Formatter().joinVoices([voice]).format([voice], width - 90);
    voice.draw(context, stave);

    for (const [from, to] of ties) {
      new StaveTie({
        firstNote: allNotes[from],
        lastNote: allNotes[to],
        firstIndexes: [0],
        lastIndexes: [0]
      })
        .setContext(context)
        .draw();
    }
  };

  $effect(() => {
    // Explicitly list dependencies to watch
    const _ = [units, height, container];

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
    justify-content: flex-start;
  }

  /* The stave is wider than the card for long words — scroll, don't squish */
  .notation-container :global(svg) {
    flex-shrink: 0;
  }
</style>
