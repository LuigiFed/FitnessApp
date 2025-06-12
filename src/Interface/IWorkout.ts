export interface muscleGroups {
  id: string;
  name: string;
}

export interface Workout {
  id: string;
  name: string;
  muscle_groups: muscleGroups[];
}

export interface Exercise {
  workouts: any;
  workout_id: string;
  muscle_group_id: string;
  id: string;
  name: string;
  sets: number;
  reps: number;
  month: number;
}

export const monthSecondaryGroups: {
  [key: string]: { primario: string; secondario: string }[];
} = {
  1: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  2: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  3: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  4: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  5: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  6: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  7: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  8: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  9: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  10: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  11: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
  12: [
    { primario: 'petto', secondario: 'bicipiti' },
    { primario: 'petto', secondario: 'tricipiti' },
    { primario: 'petto', secondario: 'spalle' },
    { primario: 'schiena', secondario: 'bicipiti' },
    { primario: 'schiena', secondario: 'tricipiti' },
    { primario: 'schiena', secondario: 'spalle' },
    { primario: 'gambe', secondario: 'bicipiti' },
    { primario: 'gambe', secondario: 'tricipiti' },
    { primario: 'gambe', secondario: 'spalle' },
  ],
};
