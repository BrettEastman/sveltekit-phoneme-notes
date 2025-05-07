export interface Note {
  name: string;
  frequency: number;
  octave: number;
  fullName: string;
}

export type NoteKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
