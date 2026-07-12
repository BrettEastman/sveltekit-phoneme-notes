// Shared playback-output selection: the built-in sine synth or a Web MIDI
// port. Svelte 5 runes module so every page's OutputSelector and the audio
// dispatcher see the same state.

import {
  initMidi,
  listOutputs,
  midiSupported,
  onMidiStateChange,
  type MidiOutputInfo
} from './midi';

export const SYNTH_OUTPUT = 'synth';

const STORAGE_KEY = 'phoneme-notes:output';

export const outputState = $state({
  selectedId: SYNTH_OUTPUT as string,
  outputs: [] as MidiOutputInfo[],
  midiReady: false
});

const storedId = (): string => {
  if (typeof localStorage === 'undefined') return SYNTH_OUTPUT;
  return localStorage.getItem(STORAGE_KEY) ?? SYNTH_OUTPUT;
};

export const selectOutput = (id: string): void => {
  outputState.selectedId = id;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, id);
  }
};

const refreshOutputs = (): void => {
  outputState.outputs = listOutputs();
  const available = (id: string) =>
    outputState.outputs.some((output) => output.id === id);
  if (outputState.selectedId !== SYNTH_OUTPUT && !available(outputState.selectedId)) {
    // Device unplugged — play through the synth, but keep the stored
    // preference so a replug reselects it below
    outputState.selectedId = SYNTH_OUTPUT;
  }
  const preferred = storedId();
  if (
    outputState.selectedId === SYNTH_OUTPUT &&
    preferred !== SYNTH_OUTPUT &&
    available(preferred)
  ) {
    outputState.selectedId = preferred;
  }
};

// Requests MIDI access (may prompt — call from a user gesture) and restores
// the persisted port choice if that device is present.
export const enableMidi = async (): Promise<void> => {
  await initMidi();
  if (!outputState.midiReady) {
    outputState.midiReady = true;
    onMidiStateChange(refreshOutputs);
  }
  refreshOutputs();
};

// On page load, silently reconnect when the browser already granted MIDI
// access in a previous visit (no prompt, no gesture needed).
export const restoreMidiIfGranted = async (): Promise<void> => {
  if (!midiSupported() || outputState.midiReady) return;
  if (storedId() === SYNTH_OUTPUT) return;
  try {
    const status = await navigator.permissions.query({
      name: 'midi' as PermissionName
    });
    if (status.state === 'granted') {
      await enableMidi();
    }
  } catch {
    // Permissions API can't tell us — the user can click "Use MIDI output…"
  }
};
