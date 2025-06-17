import { Component } from '@angular/core';
import { ExerciseProgressWithName } from '../../../Interface/IWorkout';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-show-progress',
  imports: [],
  templateUrl: './show-progress.component.html',
  styleUrl: './show-progress.component.css'
})
export class ShowProgressComponent {
  progressi: ExerciseProgressWithName[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.progressi = await this.supabase.getExerciseProgressWithName();
    } catch (error) {
      console.error('Errore caricamento progressi:', error);
    }
  }

}
