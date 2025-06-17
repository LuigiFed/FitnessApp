import { Routes } from '@angular/router';
import { WorkOutComponent } from './components/work-out/work-out.component';
import { ShowProgressComponent } from './components/show-progress/show-progress.component';

export const routes: Routes = [
  { path: '', redirectTo: 'work-out', pathMatch: 'full' },
  { path: 'work-out' , component: WorkOutComponent },
  { path: 'show-progress', component: ShowProgressComponent },
  { path: '**', redirectTo: 'work-out' },
];
