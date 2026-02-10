import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  teamMembers = [
    { name: 'Yash Kumar', role: 'Founder & CEO', icon: 'person' },
    { name: 'Engineering Team', role: 'Full-Stack Development', icon: 'code' },
    { name: 'Design Team', role: 'UI/UX Design', icon: 'palette' },
  ];

  milestones = [
    { year: '2024', text: 'Hiring Toll founded with a mission to democratize tech interview prep' },
    { year: '2025', text: 'Launched practice arena with 100+ coding challenges and MCQ assessments' },
    { year: '2026', text: 'Expanded to full-stack learning platform with typing tools and resume builder' },
  ];
}
