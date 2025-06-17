import { Component } from '@angular/core';
import { ExerciseProgressWithName } from '../../../Interface/IWorkout';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-progress',
  templateUrl: './show-progress.component.html',
   standalone: true,
  imports: [
    CommonModule,FormsModule
  ],
  styleUrls: ['./show-progress.component.css']
})
export class ShowProgressComponent {
  progressi: ExerciseProgressWithName[] = [];
  eserciziUnici: string[] = [];
esercizioSelezionato = '';
  progressiFiltrati: ExerciseProgressWithName[] = [];

  constructor(private supabase: SupabaseService) {}

   async ngOnInit(): Promise<void> {
    try {
      this.progressi = await this.supabase.getExerciseProgressWithName();

      // Otteniamo i nomi unici degli esercizi
      this.eserciziUnici = Array.from(
        new Set(this.progressi.map(p => p.exercise_name))
      );

      this.esercizioSelezionato = this.eserciziUnici[0] ?? ''; // seleziona il primo di default

    } catch (error) {
      console.error('Errore caricamento progressi:', error);
    }
  }

  getProgressiFiltrati(): ExerciseProgressWithName[] {
    return this.progressi.filter(p => p.exercise_name === this.esercizioSelezionato);
  }
}
