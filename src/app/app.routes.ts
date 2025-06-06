import { Routes } from '@angular/router';
import { WorkOutComponent } from './components/work-out/work-out.component';

export const routes: Routes = [
  { path: '', redirectTo: 'work-out', pathMatch: 'full' },
  { path: 'work-out' , component: WorkOutComponent },
];
