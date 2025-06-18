import { Component } from '@angular/core';
import { ExerciseProgressWithName } from '../../../Interface/IWorkout';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-show-progress',
  templateUrl: './show-progress.component.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ChartModule
  ],
  styleUrls: ['./show-progress.component.css']
})
export class ShowProgressComponent {
  progressi: ExerciseProgressWithName[] = [];
  eserciziUnici: string[] = [];
  esercizioSelezionato = '';
  chartData: any;
  chartOptions: any;

  constructor(private supabase: SupabaseService) {
    this.configureChartOptions();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.progressi = await this.supabase.getExerciseProgressWithName();
      this.eserciziUnici = Array.from(
        new Set(this.progressi.map(p => p.exercise_name))
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

    // Sort by date ascending
    filtered.sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const labels = filtered.map(item =>
      new Date(item.created_at).toLocaleDateString()
    );

    const weights = filtered.map(item => item.weight_used);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: `Peso (kg) - ${this.esercizioSelezionato}`,
          data: weights,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };
  }

  private configureChartOptions() {
    const textColor = '#495057';
    const fontFamily = 'inherit';

    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              family: fontFamily,
              size: 14
            },
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y} kg`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              family: fontFamily
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            font: {
              family: fontFamily
            },
            callback: (value: any) => {
              return value + ' kg';
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      }
    };
  }

  getProgressiFiltrati(): ExerciseProgressWithName[] {
    return this.progressi.filter(p => p.exercise_name === this.esercizioSelezionato);
  }
}
