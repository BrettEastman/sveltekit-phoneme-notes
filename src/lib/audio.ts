import * as Tone from 'tone';

let synth: Tone.Synth | null = null;

export const initAudio = async (): Promise<void> => {
  // Initialize audio context
  await Tone.start();
  
  // Create synth if it doesn't exist
  if (!synth) {
    synth = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
  }
};

export const playNote = (noteName: string, duration: string = '8n'): void => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }
  
  // Play the note with the given duration
  synth.triggerAttackRelease(noteName, duration);
};
