import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participation-home-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participation-home-card.html',
  styleUrl: './participation-home-card.scss',
})
export class ParticipationHomeCardComponent {
  constructor(private router: Router) {}

  openParticipationTool(): void {
    this.router.navigate(['/participation']);
  }
}
