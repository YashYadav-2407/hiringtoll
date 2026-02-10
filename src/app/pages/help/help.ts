import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatExpansionModule],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class HelpComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  faqs = [
    {
      question: 'How do I get started with Hiring Toll?',
      answer: 'Sign up with your email, verify your account, and start exploring the Learn, Practice, and Assess sections from your dashboard.',
    },
    {
      question: 'Is Hiring Toll free to use?',
      answer: 'Yes! The core features including practice problems, learning tracks, and typing tests are completely free.',
    },
    {
      question: 'How do I track my progress?',
      answer: 'Your dashboard shows a streak widget, calendar with activities, and progress bars for each learning track. Mark problems as solved to track your practice progress.',
    },
    {
      question: 'Can I reset my password?',
      answer: 'Yes. On the login page, click "Forgot Password", enter your email to receive an OTP, then set a new password.',
    },
    {
      question: 'How does the typing test work?',
      answer: 'Navigate to the Typing section from the sidebar. You\'ll be given a passage to type, and the app measures your WPM, accuracy, and errors in real time.',
    },
    {
      question: 'How do I build my resume?',
      answer: 'Go to your Profile page and use the Resume Builder feature. Fill in your details and download a professionally formatted PDF.',
    },
    {
      question: 'Who can I contact for support?',
      answer: 'Reach out to us at support@hiringtoll.com or visit the Contact page. We respond within 24 hours.',
    },
  ];

  categories = [
    { icon: 'school', title: 'Getting Started', desc: 'Account setup and first steps' },
    { icon: 'code', title: 'Practice & Learn', desc: 'Using coding problems and tracks' },
    { icon: 'person', title: 'Account & Profile', desc: 'Settings, password, and profile' },
    { icon: 'bug_report', title: 'Report an Issue', desc: 'Found a bug? Let us know' },
  ];
}
