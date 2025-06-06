import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-work-out',
  imports: [CommonModule],
  templateUrl: './work-out.component.html',
  styleUrl: './work-out.component.css',
})
export class WorkOutComponent {
  openedDay: number | null = null;
  workoutDays = [
    {
      dayLabel: 'Lunedì',
      description: 'Petto + Tricipiti',
      isRest: false,
      exercises: ['Panca piana', 'Croci', 'Dips'],
    },
    {
      dayLabel: 'Martedì',
      description: 'Cardio',
      isRest: false,
      exercises: ['Corsa 5km', 'Plank', 'Crunch'],
    },
    {
      dayLabel: 'Mercoledì',
      description: 'Riposo',
      isRest: false,
      exercises: [],
    },
    // ...
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

    // Calcola la posizione per centrare l'elemento
    const scrollTo = itemLeft - containerWidth / 2 + itemWidth / 2;

    scrollContainer.scrollTo({
      left: scrollTo,
      behavior: 'smooth',
    });
  }
  toggleDay(index: number): void {
    this.openedDay = this.openedDay === index ? null : index;
  }
}
