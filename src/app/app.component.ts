import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WorkOutComponent } from './components/work-out/work-out.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,WorkOutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FitnessApp';
}
