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
  import { beatsToNotation, parseNote, staffSteps } from "./music";
  import type { Clef, SoundUnit } from "./types";

  interface Props {
    unit: SoundUnit;
    clef?: Clef;
    width?: number;
    height?: number;
  }

  let { unit, clef = "treble", width = 360, height = 220 }: Props = $props();

  // Rests sit on the middle line of whichever clef is active
  const REST_KEY: Record<Clef, string> = { treble: "b/4", bass: "d/3" };

  // Notes above A6 (with their stems and grace ornaments) need a taller
  // headroom above the stave than the default
  const A6_STEPS = staffSteps("A6");
  const needsHighHeadroom = (units: SoundUnit[]): boolean =>
    units.some(
      (u) =>
        (u.note && staffSteps(u.note) > A6_STEPS) ||
        (u.grace && staffSteps(u.grace.note) > A6_STEPS)
    );

  let container: HTMLDivElement | undefined = $state();

  const renderNotation = () => {
    if (!container) return;

    container.innerHTML = "";

    // Default headroom fits ledger lines up to A6; extreme notes get more
    const staveY = needsHighHeadroom([unit]) ? 150 : 70;

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, height + (staveY - 70));
    const context = renderer.getContext();
    context.setFont("Arial", 10);

    const stave = new Stave(10, staveY, width - 20);
    stave.addClef(clef).setContext(context).draw();

    let notes: StaveNote[];
    if (unit.rest || !unit.note) {
      notes = beatsToNotation(unit.beats).map(({ vexDuration, dotted }) => {
        const restNote = new StaveNote({
          keys: [REST_KEY[clef]],
          duration: `${vexDuration}r`,
          clef
        });
        if (dotted) {
          Dot.buildAndAttach([restNote], { all: true });
        }
        return restNote;
      });
    } else {
      const parsed = parseNote(unit.note);

      // Durations longer than a single notatable value become tied notes
      notes = beatsToNotation(unit.beats).map(({ vexDuration, dotted }, i) => {
        const staveNote = new StaveNote({
          keys: [parsed.vexKey],
          duration: vexDuration,
          clef
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
          slash: true,
          clef
        });
        notes[0].addModifier(new GraceNoteGroup([grace], true));
      }
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
    const _ = [unit, clef, width, height, container];

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
