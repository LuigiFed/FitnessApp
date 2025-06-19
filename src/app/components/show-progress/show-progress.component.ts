import { Component, HostListener } from '@angular/core';
import { ExerciseProgressWithName } from '../../../Interface/IWorkout';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-show-progress',
  templateUrl: './show-progress.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    AutoCompleteModule,
    DropdownModule,
  ],
  styleUrls: ['./show-progress.component.css'],
})
export class ShowProgressComponent {
  progressi: ExerciseProgressWithName[] = [];
  eserciziUnici: string[] = [];
  esercizioSelezionato = '';
  chartData: any;
  chartOptions: any;
  isDropdownOpen = false;

  constructor(private supabase: SupabaseService) {
    this.configureChartOptions();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.progressi = await this.supabase.getExerciseProgressWithName();
      this.eserciziUnici = Array.from(
        new Set(this.progressi.map((p) => p.exercise_name))
      );

      if (this.eserciziUnici.length > 0) {
        this.esercizioSelezionato = this.eserciziUnici[0];
        this.updateChart();
      }
    } catch (error) {
      console.error('Errore caricamento progressi:', error);
    }
  }

  onExerciseChange() {
    this.updateChart();
  }

  private updateChart() {
    const filtered = this.getProgressiFiltrati();

    if (filtered.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    filtered.sort(
      (a, b) =>
        new Date(a.created_at).getDate() - new Date(b.created_at).getDate()
    );

    const labels = filtered.map((item) => {
      const d = new Date(item.created_at);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    });
    const weights = filtered.map((item) => item.weight_used);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: `Peso (kg) - ${this.esercizioSelezionato}`,
          data: weights,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }

  private configureChartOptions() {
    const textColor = '#495057';
    const fontFamily = 'inherit';

    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: fontFamily,
              size: 14,
            },
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y} kg`;
            },
          },
        },
      },
      layout: {
        padding: {
          top: 20,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              family: fontFamily,
            },
          },
          grid: {
            color: 'rgba(0,0,0,0.05)',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            font: {
              family: fontFamily,
            },
            callback: (value: any) => {
              return value + ' kg';
            },
          },
          grid: {
            color: 'rgba(0,0,0,0.05)',
          },
        },
      },
    };
  }

  getProgressiFiltrati(): ExerciseProgressWithName[] {
    return this.progressi.filter(
      (p) => p.exercise_name === this.esercizioSelezionato
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectExercise(esercizio: string) {
    this.esercizioSelezionato = esercizio;
    this.isDropdownOpen = false;
    this.onExerciseChange(); // Chiama il tuo metodo esistente
  }

  // Listener per chiudere dropdown quando si clicca fuori
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.custom-dropdown');
    if (!dropdown) {
      this.isDropdownOpen = false;
    }
  }
}
