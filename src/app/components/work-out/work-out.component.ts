import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Exercise, muscleGroups, monthSecondaryGroups } from '../../../Interface/IWorkout';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-out',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-out.component.html',
  styleUrls: ['./work-out.component.css'],
})
export class WorkOutComponent implements OnInit, OnDestroy {
  @ViewChild('monthScroll') monthScroll!: ElementRef<HTMLDivElement>;
  @ViewChildren('monthItem') monthItems!: QueryList<ElementRef<HTMLDivElement>>;

  openedDay: number | null = null;
  exerciseWeights: { [exerciseId: string]: number } = {};
  monthSecondaryGroups = monthSecondaryGroups;

  fixedMuscleGroups = [
    { name: 'Petto', image: 'url(/chest.png)', description: 'Esercizi per il petto e tricipiti' },
    { name: 'Gambe', image: 'url(/leg.png)', description: 'Esercizi per le gambe e glutei' },
    { name: 'Schiena', image: 'url(/back.png)', description: 'Esercizi per schiena e bicipiti' },
  ];

  months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  workoutId = '';
  muscleGroups: muscleGroups[] = [];
  exercises: Exercise[] = [];
  selectedMuscleGroupExercises: Exercise[] = [];
  selectedMonthIndex = new Date().getMonth();

  private viewport?: any;
  private onViewportResize?: () => void;

  constructor(private supabase: SupabaseService, private elRef: ElementRef) {}

  ngOnInit() {
    this.loadMuscleGroups();
    this.supabase.getAllExercises().then(res => console.log(res));
    this.filterExercisesByMonth();
    this.updateVh();


    window.addEventListener('resize', this.updateVh);
    if ((window as any).visualViewport) {
      (window as any).visualViewport.addEventListener('resize', this.updateVh);
    }
  }

    updateVh() {

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
    ngOnDestroy() {
    window.removeEventListener('resize', this.updateVh);
    if ((window as any).visualViewport) {
      (window as any).visualViewport.removeEventListener('resize', this.updateVh);
    }
  }




  selectMonth(index: number) {
    this.selectedMonthIndex = index;
    this.centerActiveMonth();
    this.filterExercisesByMonth();
  }

  centerActiveMonth() {
    const scrollContainer = this.monthScroll.nativeElement;
    const activeItem = this.monthItems.toArray()[this.selectedMonthIndex].nativeElement;
    const containerWidth = scrollContainer.offsetWidth;
    const itemWidth = activeItem.offsetWidth;
    const itemLeft = activeItem.offsetLeft;
    const scrollTo = itemLeft - containerWidth / 2 + itemWidth / 2;

    scrollContainer.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }

  async toggleDay(index: number) {
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
      const secondaryMuscleGroups = await this.supabase.getSecondaryGroupsForMonth(monthNum, mainMuscleGroup.id);
      const groupsToFetch = [mainMuscleGroup, ...secondaryMuscleGroups];
      const exercisePromises = groupsToFetch.map(group =>
        this.supabase.getExercisesByMuscleGroup(group.id).then(res => res.data ?? [])
      );
      const allExercisesArrays = await Promise.all(exercisePromises);
      const allExercises = allExercisesArrays.flat();
      const filteredExercises = allExercises.filter(ex => Number(ex.month) === monthNum);
      this.selectedMuscleGroupExercises = Array.from(
        new Set(filteredExercises.map(ex => ex.id))
      ).map(id => filteredExercises.find(ex => ex.id === id)!) as Exercise[];
    } catch (error) {
      console.error('Errore nel caricamento degli esercizi:', error);
      this.selectedMuscleGroupExercises = [];
    }
  }

  findMatchingMuscleGroup(fixedGroupName: string): muscleGroups | undefined {
    const searchName = fixedGroupName.trim().toLowerCase();

    return this.muscleGroups.find(mg => {
      const dbName = mg.name.trim().toLowerCase();
      switch (searchName) {
        case 'petto': return ['petto','chest','torace','pettorale'].some(k => dbName.includes(k));
        case 'gambe': return ['gambe','leg','quad','cosce','polpacci','quadricipiti','femorali','glutei'].some(k => dbName.includes(k));
        case 'schiena':
        case 'dorso': return ['schiena','back','dorso','dorsali','trapezi'].some(k => dbName.includes(k));
        case 'bicipiti': return dbName.includes('bicipiti') || (dbName.includes('braccia') && !dbName.includes('tricipiti'));
        case 'tricipiti': return dbName.includes('tricipiti') || (dbName.includes('braccia') && !dbName.includes('bicipiti'));
        case 'spalle': return ['spalle','shoulder','deltoidi','deltoide'].some(k => dbName.includes(k));
        default: return dbName.includes(searchName) || searchName.includes(dbName);
      }
    });
  }

  filterExercisesByMonth() {
    const monthNumber = this.selectedMonthIndex + 1;
    this.selectedMuscleGroupExercises = this.exercises.filter(
      ex => Number(ex.month) === monthNumber
    );
  }

  async loadMuscleGroups() {
    const { data, error } = await this.supabase.getMuscleGroups();
    if (!error && data) this.muscleGroups = data;
  }

  async loadExercisesForMuscleGroup(muscleGroupId: string) {
    try {
      const { data, error } = await this.supabase.getExercisesByMuscleGroup(muscleGroupId);
      if (!error && data) {
        this.exercises = data;
        this.filterExercisesByMonth();
      }
    } catch (error) {
      console.error('Errore nel caricamento degli esercizi:', error);
      this.selectedMuscleGroupExercises = [];
    }
  }

  async loadExercise() {
    const { data, error } = await this.supabase.getWorkoutWithExercises(this.workoutId);
    if (!error) console.log(data);
  }

  saveWeight(exerciseId: string) {
    const weight = this.exerciseWeights[exerciseId];
    if (weight != null) {
      this.supabase.saveExerciseWeight(exerciseId, weight)
        .then(() => console.log('Peso salvato con successo'))
        .catch(err => console.error(err));
    }
  }

  async saveAllProgress() {
    try {
      for (const exercise of this.selectedMuscleGroupExercises) {
        const weight = this.exerciseWeights[exercise.id];
        if (weight != null && weight > 0) {
          await this.supabase.saveExerciseWeight(exercise.id, weight);
          this.exerciseWeights[exercise.id] = 0;
        }
      }
      alert('Progressi salvati con successo!');
    } catch (error) {
      alert('Errore durante il salvataggio dei progressi.');
      console.error(error);
    }
  }
}
