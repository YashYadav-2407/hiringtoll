import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.scss',
})
export class WelcomeCardComponent {}
