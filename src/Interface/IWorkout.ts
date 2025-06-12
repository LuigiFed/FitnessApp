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
}
