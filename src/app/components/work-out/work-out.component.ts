import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Exercise, muscleGroups } from '../../../Interface/IWorkout';

@Component({
  selector: 'app-work-out',
  imports: [CommonModule],
  templateUrl: './work-out.component.html',
  styleUrl: './work-out.component.css',
})
export class WorkOutComponent {
  constructor(private supabase: SupabaseService) {
    setTimeout(() => {
      this.loadMuscleGroups();
    }, 100);
  }
  ngOnInit() {
    this.loadMuscleGroups();

    this.supabase.getAllExercises().then((res) => console.log(res));
  }

  openedDay: number | null = null;

  fixedMuscleGroups = [
    {
      name: 'Petto',
      image: 'url(/chest.png)',
      description: 'Esercizi per il petto e tricipiti',
    },
    {
      name: 'Gambe',
      image: 'url(/leg.png)',
      description: 'Esercizi per le gambe e glutei',
    },
    {
      name: 'Schiena',
      image: 'url(/back.png)',
      description: 'Esercizi per schiena e bicipiti',
    },
  ];

  months = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ];

  workoutId: string = '';
  muscleGroups: muscleGroups[] = [];
  exercises: Exercise[] = [];
  selectedMuscleGroupExercises: Exercise[] = [];
  selectedMonthIndex = new Date().getMonth();

  @ViewChild('monthScroll') monthScroll!: ElementRef<HTMLDivElement>;
  @ViewChildren('monthItem') monthItems!: QueryList<ElementRef<HTMLDivElement>>;

  ngAfterViewInit() {
    setTimeout(() => this.centerActiveMonth(), 100);
  }

  selectMonth(index: number) {
    this.selectedMonthIndex = index;
    this.centerActiveMonth();
  }

  centerActiveMonth() {
    const scrollContainer = this.monthScroll.nativeElement;
    const activeItem =
      this.monthItems.toArray()[this.selectedMonthIndex].nativeElement;

    const containerWidth = scrollContainer.offsetWidth;
    const itemWidth = activeItem.offsetWidth;
    const itemLeft = activeItem.offsetLeft;

    const scrollTo = itemLeft - containerWidth / 2 + itemWidth / 2;

    scrollContainer.scrollTo({
      left: scrollTo,
      behavior: 'smooth',
    });
  }

  async toggleDay(index: number): Promise<void> {
    if (this.openedDay === index) {
      this.openedDay = null;
      this.selectedMuscleGroupExercises = [];
    } else {
      this.openedDay = index;
      const selectedGroup = this.fixedMuscleGroups[index];
      console.log('Selezionato gruppo fisso:', selectedGroup.name);
      const muscleGroup = this.findMatchingMuscleGroup(selectedGroup.name);
      console.log('Gruppo muscolare trovato nel DB:', muscleGroup);

      if (muscleGroup) {
        await this.loadExercisesForMuscleGroup(muscleGroup.id);
      } else {
        console.log(
          `Nessun gruppo muscolare trovato per: ${selectedGroup.name}`
        );
        this.selectedMuscleGroupExercises = [];
      }
    }
  }

  // Funzione helper per trovare il gruppo muscolare corrispondente
  findMatchingMuscleGroup(fixedGroupName: string): muscleGroups | undefined {
    const searchName = fixedGroupName.trim().toLowerCase();

    return this.muscleGroups.find((mg) => {
      const dbName = mg.name.trim().toLowerCase();

      switch (searchName) {
        case 'petto':
          return (
            dbName.includes('petto') ||
            dbName.includes('chest') ||
            dbName.includes('torace')
          );
        case 'gambe':
          return (
            dbName.includes('gambe') ||
            dbName.includes('leg') ||
            dbName.includes('quad') ||
            dbName.includes('cosce') ||
            dbName.includes('polpacci')
          );
        case 'schiena':
          return (
            dbName.includes('schiena') ||
            dbName.includes('back') ||
            dbName.includes('dorso')
          );
        default:
          return dbName.includes(searchName);
        case 'bicipiti':
          return dbName.includes('bicipiti') || dbName.includes('braccia');
        case 'tricipiti':
          return dbName.includes('tricipiti') || dbName.includes('braccia');
        case 'spalle':
          return dbName.includes('spalle');
      }
    });
  }

  async loadMuscleGroups() {
    const { data, error } = await this.supabase.getMuscleGroups();
    if (!error && data) {
      this.muscleGroups = data;
    }
    console.log(this.muscleGroups);
  }

  async loadExercisesForMuscleGroup(muscleGroupId: string) {
    try {
      const { data, error } = await this.supabase.getExercisesByMuscleGroup(
        muscleGroupId
      );
      if (!error && data) {
        this.selectedMuscleGroupExercises = data.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          workout_id: exercise.workout_id,
          muscle_group_id: muscleGroupId,
          workouts: exercise.workouts,
        }));
        console.log(
          'Esercizi caricati per gruppo muscolare:',
          this.selectedMuscleGroupExercises
        );
      } else if (error) {
        console.error('Errore nel caricamento esercizi:', error);
        this.selectedMuscleGroupExercises = [];
      }
    } catch (error) {
      console.error('Errore nella chiamata al database:', error);
      this.selectedMuscleGroupExercises = [];
    }
  }

  async loadExercise() {
    const { data, error } = await this.supabase.getWorkoutWithExercises(
      this.workoutId
    );
    if (!error) console.log(data);
  }
}
