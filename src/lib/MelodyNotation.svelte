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
  import { beatsToNotation, parseNote, type ParsedNote } from "./music";
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

    // Sharps and flats are always drawn (courtesy style — melodies here can
    // run long without barlines). A natural is drawn only when it cancels a
    // sharp/flat previously in force at the same staff position (letter +
    // octave), e.g. A♭5 then A5.
    const accidentalInForce = new Map<string, "#" | "b">();
    const applyAccidental = (note: StaveNote, parsed: ParsedNote) => {
      const position = `${parsed.letter}/${parsed.octave}`;
      if (parsed.accidental) {
        note.addModifier(new Accidental(parsed.accidental));
        accidentalInForce.set(position, parsed.accidental);
      } else if (accidentalInForce.has(position)) {
        note.addModifier(new Accidental("n"));
        accidentalInForce.delete(position);
      }
    };

    for (const unit of units) {
      const parsed = parseNote(unit.note);
      const firstIndex = allNotes.length;

      beatsToNotation(unit.beats).forEach(({ vexDuration, dotted }, i) => {
        const staveNote = new StaveNote({
          keys: [parsed.vexKey],
          duration: vexDuration
        });
        if (dotted) {
          Dot.buildAndAttach([staveNote], { all: true });
        }
        if (i > 0) {
          ties.push([allNotes.length - 1, allNotes.length]);
        }
        allNotes.push(staveNote);
      });

      // The grace note reads (and sounds) before the main note, so it takes
      // part in the accidental bookkeeping first. When the ornament sits on
      // the same pitch as its main note, the pair shares the grace's
      // accidental, engraver style.
      let accidentalCoveredByGrace = false;
      if (unit.grace) {
        const parsedGrace = parseNote(unit.grace.note);
        const grace = new GraceNote({
          keys: [parsedGrace.vexKey],
          duration: "8",
          slash: true
        });
        applyAccidental(grace, parsedGrace);
        allNotes[firstIndex].addModifier(new GraceNoteGroup([grace], true));
        accidentalCoveredByGrace = parsedGrace.vexKey === parsed.vexKey;
      }
      if (!accidentalCoveredByGrace) {
        applyAccidental(allNotes[firstIndex], parsed);
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
