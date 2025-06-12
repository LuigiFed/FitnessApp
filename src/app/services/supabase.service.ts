import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://eohhpvxwebcusnctwzsb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaGhwdnh3ZWJjdXNuY3R3enNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzU3MDYsImV4cCI6MjA2NTIxMTcwNn0.NIv3lWG_aWOgekq5Po5NKXxKgvh-n9CdiED59glWjik'
    );
  }


  async getMuscleGroups() {
    return await this.supabase.from('muscle_groups').select('*');
  }


  async createWorkout(name: string) {
    return await this.supabase.from('workouts').insert([{ name }]).select();
  }


  async addExercise(workoutId: string, muscleGroupId: string, name: string, sets: number, reps: number) {
    return await this.supabase.from('exercises').insert([
      { workout_id: workoutId, muscle_group_id: muscleGroupId, name, sets, reps }
    ]);
  }


  async getWorkoutWithExercises(workoutId: string) {
    return await this.supabase
      .from('exercises')
      .select(`
        id,
        name,
        sets,
        reps,
        month,
        muscle_groups (
          id,
          name
        )
      `)
      .eq('workout_id', workoutId);
  }


 getExercisesByMuscleGroup(muscleGroupId: string) {
  return this.supabase
    .from('exercises')
    .select('*')
    .eq('muscle_group_id', muscleGroupId);
}

  async getAllExercises() {
    return await this.supabase
      .from('exercises')
      .select(`
        id,
        name,
        sets,
        reps,
        month,
        workouts (
          id,
          name
        ),
        muscle_groups (
          id,
          name
        )
      `);
  }


  async getAllWorkouts() {
    return await this.supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });
  }
}
