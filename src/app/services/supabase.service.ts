import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { muscleGroups } from '../../Interface/IWorkout';

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

async getMonthlyRotation() {
  return await this.supabase.from('monthly_rotation').select('*');
}
async getSecondaryGroupsForMonth(month: number, primaryId: string): Promise<muscleGroups[]> {
  const { data, error } = await this.supabase
    .from('monthly_rotations')
    .select('secondary_id, muscle_groups:muscle_groups!monthly_rotations_secondary_id_fkey(name)')
    .eq('month', month)
    .eq('primary_id', primaryId);

  if (error) {
    console.error('Errore nel recupero delle rotazioni mensili:', error);
    return [];
  }

  if (!data) return [];

  return data.map((r: { secondary_id: string; muscle_groups: { name: string }[] }) => ({
    id: r.secondary_id,
    name: r.muscle_groups[0]?.name ?? 'Nome non trovato'
  }));
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
