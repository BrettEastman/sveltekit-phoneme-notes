<script lang="ts">
  import {
    Accidental,
    ClefNote,
    Dot,
    Formatter,
    GraceNote,
    GraceNoteGroup,
    Renderer,
    Stave,
    StaveNote,
    StaveTie,
    Voice,
    type Note
  } from "vexflow";
  import { beatsToNotation, parseNote, staffSteps, type ParsedNote } from "./music";
  import type { Clef, SoundUnit } from "./types";

  interface Props {
    units: SoundUnit[];
    clef?: Clef;
    height?: number;
  }

  let { units, clef = "treble", height = 220 }: Props = $props();

  let container: HTMLDivElement | undefined = $state();

  // Rests sit on the middle line of whichever clef is active
  const REST_KEY: Record<Clef, string> = { treble: "b/4", bass: "d/3" };

  // Notes above A6 (with their stems and grace ornaments) need a taller
  // headroom above the stave than the default
  const A6_STEPS = staffSteps("A6");
  const needsHighHeadroom = (melody: SoundUnit[]): boolean =>
    melody.some(
      (u) =>
        (u.note && staffSteps(u.note) > A6_STEPS) ||
        (u.grace && staffSteps(u.grace.note) > A6_STEPS)
    );

  const renderNotation = () => {
    if (!container) return;

    container.innerHTML = "";
    if (units.length === 0) return;

    const tickables: Note[] = [];
    // Pairs of indexes into tickables to tie (notes within one unit)
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

    let currentClef: Clef = clef;

    for (const unit of units) {
      if (unit.rest || !unit.note) {
        // Rests inherit whatever clef is in force
        beatsToNotation(unit.beats).forEach(({ vexDuration, dotted }) => {
          const restNote = new StaveNote({
            keys: [REST_KEY[currentClef]],
            duration: `${vexDuration}r`
          });
          if (dotted) {
            Dot.buildAndAttach([restNote], { all: true });
          }
          tickables.push(restNote);
        });
        continue;
      }

      // Mid-staff clef change when a unit lives in the other register
      // (e.g. Messiaen's bass-clef letters)
      const unitClef = unit.clef ?? clef;
      if (unitClef !== currentClef) {
        tickables.push(new ClefNote(unitClef, "small"));
        currentClef = unitClef;
      }

      const parsed = parseNote(unit.note);
      const unitNotes: StaveNote[] = [];

      beatsToNotation(unit.beats).forEach(({ vexDuration, dotted }, i) => {
        const staveNote = new StaveNote({
          keys: [parsed.vexKey],
          duration: vexDuration,
          clef: currentClef
        });
        if (dotted) {
          Dot.buildAndAttach([staveNote], { all: true });
        }
        if (i > 0) {
          ties.push([tickables.length - 1, tickables.length]);
        }
        tickables.push(staveNote);
        unitNotes.push(staveNote);
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
          slash: true,
          clef: currentClef
        });
        applyAccidental(grace, parsedGrace);
        unitNotes[0].addModifier(new GraceNoteGroup([grace], true));
        accidentalCoveredByGrace = parsedGrace.vexKey === parsed.vexKey;
      }
      if (!accidentalCoveredByGrace) {
        applyAccidental(unitNotes[0], parsed);
      }
    }

    // Scale the stave with the melody length; the container scrolls
    const width = Math.max(360, 120 + tickables.length * 70);
    // Default headroom fits ledger lines up to A6; extreme notes get more
    const staveY = needsHighHeadroom(units) ? 150 : 70;

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, height + (staveY - 70));
    const context = renderer.getContext();
    context.setFont("Arial", 10);

    const stave = new Stave(10, staveY, width - 20);
    stave.addClef(clef).setContext(context).draw();

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.setStrict(false);
    voice.addTickables(tickables);

    new Formatter().joinVoices([voice]).format([voice], width - 90);
    voice.draw(context, stave);

    for (const [from, to] of ties) {
      new StaveTie({
        firstNote: tickables[from],
        lastNote: tickables[to],
        firstIndexes: [0],
        lastIndexes: [0]
      })
        .setContext(context)
        .draw();
    }
  };

  $effect(() => {
    // Explicitly list dependencies to watch
    const _ = [units, clef, height, container];

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
