import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './careers.html',
  styleUrl: './careers.scss',
})
export class CareersComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  openings = [
    { title: 'Senior Full-Stack Developer', team: 'Engineering', location: 'Remote', type: 'Full-Time', icon: 'code' },
    { title: 'UI/UX Designer', team: 'Design', location: 'Remote', type: 'Full-Time', icon: 'palette' },
    { title: 'DevOps Engineer', team: 'Infrastructure', location: 'Remote', type: 'Full-Time', icon: 'cloud' },
    { title: 'Content Creator', team: 'Education', location: 'Remote', type: 'Part-Time', icon: 'edit_note' },
  ];

  perks = [
    { icon: 'home', text: '100% Remote Work' },
    { icon: 'school', text: 'Learning Budget' },
    { icon: 'health_and_safety', text: 'Health Insurance' },
    { icon: 'schedule', text: 'Flexible Hours' },
    { icon: 'devices', text: 'Equipment Provided' },
    { icon: 'celebration', text: 'Team Events' },
  ];
}
