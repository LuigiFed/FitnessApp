import { Component, HostListener } from '@angular/core';
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

  @HostListener('focusin')
  onFocusIn() {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  @HostListener('focusout')
  onFocusOut() {
    // Timeout breve per aspettare che la tastiera si chiuda del tutto
    setTimeout(() => {
      document.body.style.position = '';
      document.body.style.width = '';
      window.scrollTo(0, 0);
    }, 100);
  }

}
