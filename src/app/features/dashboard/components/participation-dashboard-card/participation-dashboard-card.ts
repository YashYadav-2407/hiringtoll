import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type ParticipationCategory = 'All' | 'Hackathon' | 'Contest' | 'Workshop' | 'Meetup';

interface ParticipationEventPreview {
  id: string;
  title: string;
  platform: 'Unstop' | 'Devfolio' | 'MLH' | 'HackerEarth';
  category: Exclude<ParticipationCategory, 'All'>;
  deadline: string;
  mode: 'Online' | 'Offline';
  prize: string;
  tags: string[];
  applyUrl: string;
}

@Component({
  selector: 'app-participation-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participation-dashboard-card.html',
  styleUrl: './participation-dashboard-card.scss',
})
export class ParticipationDashboardCardComponent {
  selectedParticipationCategory: ParticipationCategory = 'All';

  readonly participationCategories: ParticipationCategory[] = ['All', 'Hackathon', 'Contest', 'Workshop', 'Meetup'];

  readonly participationEvents: ParticipationEventPreview[] = [
    {
      id: 'ai-builders',
      title: 'AI Builders Challenge',
      platform: 'Unstop',
      category: 'Hackathon',
      deadline: '20 Apr 2026',
      mode: 'Online',
      prize: 'INR 2,00,000',
      tags: ['AI', 'Web', 'Product'],
      applyUrl: 'https://unstop.com/hackathons/ai-builders-challenge',
    },
    {
      id: 'frontend-contest',
      title: 'Frontend Coding Contest',
      platform: 'HackerEarth',
      category: 'Contest',
      deadline: '24 Apr 2026',
      mode: 'Online',
      prize: 'INR 75,000',
      tags: ['Frontend', 'CSS', 'UI'],
      applyUrl: 'https://www.hackerearth.com/challenges/contests/frontend-coding-contest',
    },
    {
      id: 'product-night',
      title: 'Product Build Night',
      platform: 'Devfolio',
      category: 'Workshop',
      deadline: '26 Apr 2026',
      mode: 'Offline',
      prize: 'Mentorship',
      tags: ['Startup', 'AI', 'Pitch'],
      applyUrl: 'https://devfolio.co/events/product-build-night',
    },
    {
      id: 'cloud-meetup',
      title: 'Cloud Native Meetup',
      platform: 'MLH',
      category: 'Meetup',
      deadline: '01 May 2026',
      mode: 'Offline',
      prize: 'Talk Slots + Swag',
      tags: ['Cloud', 'Backend', 'DevOps'],
      applyUrl: 'https://mlh.io/events/cloud-native-meetup',
    },
  ];

  constructor(private router: Router) {}

  setParticipationCategory(category: ParticipationCategory): void {
    this.selectedParticipationCategory = category;
  }

  isActiveParticipationCategory(category: ParticipationCategory): boolean {
    return this.selectedParticipationCategory === category;
  }

  get filteredParticipationEvents(): ParticipationEventPreview[] {
    if (this.selectedParticipationCategory === 'All') {
      return this.participationEvents;
    }

    return this.participationEvents.filter((event) => event.category === this.selectedParticipationCategory);
  }

  openParticipationHub(): void {
    this.router.navigate(['/participation']);
  }

  applyToEvent(event: ParticipationEventPreview): void {
    if (typeof window !== 'undefined') {
      window.open(event.applyUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
