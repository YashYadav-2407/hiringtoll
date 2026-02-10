import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class PrivacyComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  lastUpdated = 'January 1, 2025';

  sections = [
    {
      title: 'Information We Collect',
      icon: 'inventory_2',
      content: `We collect information you provide directly, such as your name, email address, and profile details when you create an account. We also collect usage data including practice problems solved, learning progress, and typing test results to personalize your experience.`,
    },
    {
      title: 'How We Use Your Information',
      icon: 'analytics',
      content: `Your information is used to provide and improve our services, track your learning progress, personalize content, send important account notifications, and maintain platform security. We do not sell your personal information to third parties.`,
    },
    {
      title: 'Data Storage & Security',
      icon: 'lock',
      content: `Your data is stored securely using industry-standard encryption. Passwords are hashed and never stored in plain text. We use HTTPS for all data transmission and regularly audit our security practices.`,
    },
    {
      title: 'Cookies & Local Storage',
      icon: 'cookie',
      content: `We use browser local storage to save your preferences, authentication tokens, and learning progress. This data stays on your device and helps provide a seamless experience across sessions.`,
    },
    {
      title: 'Your Rights',
      icon: 'gavel',
      content: `You have the right to access, update, or delete your personal information at any time through your Profile settings. You can also request a full data export or account deletion by contacting our support team.`,
    },
    {
      title: 'Changes to This Policy',
      icon: 'update',
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes through email or an in-app notification. Your continued use of the platform after changes constitutes acceptance.`,
    },
  ];
}
