import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import {
  Exercise,
  muscleGroups,
  monthSecondaryGroups,
} from '../../../Interface/IWorkout';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-work-out',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-out.component.html',
  styleUrls: ['./work-out.component.css'], // attenzione qui, styleUrls al plurale
})
export class WorkOutComponent implements OnInit, AfterViewInit {
  constructor(private supabase: SupabaseService) {}

  openedDay: number | null = null;
  exerciseWeights: { [exerciseId: string]: number } = {};
  monthSecondaryGroups = monthSecondaryGroups;
  timerRunning = false;
  digits = Array.from({ length: 10 }, (_, i) => i);
timer: any = null;
milliseconds = 0;
displayTime = '00:00:00';

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

  ngOnInit() {
    this.loadMuscleGroups();
    this.supabase.getAllExercises().then((res) => console.log(res));
    this.filterExercisesByMonth();
  }

  ngAfterViewInit() {
    setTimeout(() => this.centerActiveMonth(), 100);
  }

  onInputBlur(event: FocusEvent) {
    const inputEl = event.target as HTMLInputElement;

    setTimeout(() => {
      const container = document.querySelector(
        '.workout-container'
      ) as HTMLElement;
      if (container) {
        container.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 100);
  }

  selectMonth(index: number) {
    this.selectedMonthIndex = index;
    this.centerActiveMonth();
    this.filterExercisesByMonth();
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
      return;
    }

    this.openedDay = index;

    const monthNum = this.selectedMonthIndex + 1;
    const mainGroupName = this.fixedMuscleGroups[index].name.toLowerCase();

    const mainMuscleGroup = this.findMatchingMuscleGroup(mainGroupName);
    if (!mainMuscleGroup) {
      console.warn(`Gruppo muscolare primario '${mainGroupName}' non trovato`);
      this.selectedMuscleGroupExercises = [];
      return;
    }

    try {
      const secondaryMuscleGroups =
        await this.supabase.getSecondaryGroupsForMonth(
          monthNum,
          mainMuscleGroup.id
        );

      const groupsToFetch = [mainMuscleGroup, ...secondaryMuscleGroups];

      const exercisePromises = groupsToFetch.map((group) =>
        this.supabase
          .getExercisesByMuscleGroup(group.id)
          .then((res) => res.data ?? [])
      );

      const allExercisesArrays = await Promise.all(exercisePromises);
      const allExercises = allExercisesArrays.flat();

      const filteredExercises = allExercises.filter(
        (ex) => Number(ex.month) === monthNum
      );

      const uniqueExercises = filteredExercises.filter(
        (exercise, index, self) =>
          index === self.findIndex((ex) => ex.id === exercise.id)
      );

      this.selectedMuscleGroupExercises = uniqueExercises;

      console.log('Esercizi trovati per tutti i gruppi:', allExercises.length);
      console.log('Esercizi filtrati per mese:', filteredExercises.length);
      console.log(
        'Esercizi unici selezionati:',
        this.selectedMuscleGroupExercises.length
      );
    } catch (error) {
      console.error('Errore nel caricamento degli esercizi:', error);
      this.selectedMuscleGroupExercises = [];
    }
  }

  findMatchingMuscleGroup(fixedGroupName: string): muscleGroups | undefined {
    const searchName = fixedGroupName.trim().toLowerCase();

    return this.muscleGroups.find((mg) => {
      const dbName = mg.name.trim().toLowerCase();

      switch (searchName) {
        case 'petto':
          return (
            dbName.includes('petto') ||
            dbName.includes('chest') ||
            dbName.includes('torace') ||
            dbName.includes('pettorale')
          );

        case 'gambe':
          return (
            dbName.includes('gambe') ||
            dbName.includes('leg') ||
            dbName.includes('quad') ||
            dbName.includes('cosce') ||
            dbName.includes('polpacci') ||
            dbName.includes('quadricipiti') ||
            dbName.includes('femorali') ||
            dbName.includes('glutei')
          );

        case 'schiena':
        case 'dorso':
          return (
            dbName.includes('schiena') ||
            dbName.includes('back') ||
            dbName.includes('dorso') ||
            dbName.includes('dorsali') ||
            dbName.includes('trapezi')
          );

        case 'bicipiti':
          return (
            dbName.includes('bicipiti') ||
            dbName.includes('biceps') ||
            (dbName.includes('braccia') && !dbName.includes('tricipiti'))
          );

        case 'tricipiti':
          return (
            dbName.includes('tricipiti') ||
            dbName.includes('triceps') ||
            (dbName.includes('braccia') && !dbName.includes('bicipiti'))
          );

        case 'spalle':
          return (
            dbName.includes('spalle') ||
            dbName.includes('shoulder') ||
            dbName.includes('deltoidi') ||
            dbName.includes('deltoide')
          );

        default:
          return dbName.includes(searchName) || searchName.includes(dbName);
      }
    });
  }

  filterExercisesByMonth() {
    const monthNumber = this.selectedMonthIndex + 1;
    this.selectedMuscleGroupExercises = this.exercises.filter(
      (exercise) => Number(exercise.month) === monthNumber
    );
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
        this.exercises = data;
        this.selectedMuscleGroupExercises = data.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          workout_id: exercise.workout_id,
          muscle_group_id: muscleGroupId,
          workouts: exercise.workouts,
          month: exercise.month,
        }));
        this.filterExercisesByMonth();
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

  saveWeight(exerciseId: string) {
    const weight = this.exerciseWeights[exerciseId];
    if (weight != null) {
      this.supabase
        .saveExerciseWeight(exerciseId, weight)
        .then(() => {
          console.log('Peso salvato con successo');
        })
        .catch((err) => console.error(err));
    }
  }
  async saveAllProgress() {
    try {
      for (const exercise of this.selectedMuscleGroupExercises) {
        const weight = this.exerciseWeights[exercise.id];
        if (weight != null && weight > 0) {
          await this.supabase.saveExerciseWeight(exercise.id, weight);
          this.exerciseWeights[exercise.id] = 0;
          Swal.fire({
            title: 'Ottimo Lavoro!',
            text: 'Progressi salvati con successo!',
            icon: 'success',
          });
        }
        else {
          Swal.fire({
            title: 'Errore!',
            text: 'Non hai inserito alcun peso!',
            icon: 'error',
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Errore!',
        text: 'Si è verificato un errore!',
        icon: 'error',
      });
    }
  }
startTimer() {
  if (this.timerRunning) return;
  this.timerRunning = true;
  this.timer = setInterval(() => {
    this.milliseconds += 10; // ogni 10 ms = 1 centisecondo
    this.displayTime = this.formatTime(this.milliseconds);
  }, 10);
}

pauseTimer() {
  this.timerRunning = false;
  clearInterval(this.timer);
}

resetTimer() {
  this.pauseTimer();
  this.milliseconds = 0;
  this.displayTime = '00:00:00';
}

formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
}
}
