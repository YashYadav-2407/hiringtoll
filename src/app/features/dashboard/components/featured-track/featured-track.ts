import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-track',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './featured-track.html',
  styleUrl: './featured-track.scss'
})
export class FeaturedTrackComponent {
  constructor(private router: Router) {}

  startTrack() {
    this.router.navigate(['/practice']);
  }
}
