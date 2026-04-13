import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../header/header';
import { WelcomeCardComponent } from '../components/welcome-card/welcome-card';
import { FeaturedTrackComponent } from '../components/featured-track/featured-track';
import { StreakWidgetComponent } from '../components/streak-widget/streak-widget';
import { FooterComponent } from '../../../core/footer/footer';
import { CalendarTodoComponent } from '../components/calendar-todo/calendar-todo';
import { ParticipationWidgetComponent } from '../components/participation-widget/participation-widget';

type DashboardTab = 'focus' | 'streak' | 'planner' | 'participation';

interface DashboardTabConfig {
  id: DashboardTab;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    WelcomeCardComponent,
    FeaturedTrackComponent,
    StreakWidgetComponent,
    FooterComponent,
    CalendarTodoComponent,
    ParticipationWidgetComponent,

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  activeTab: DashboardTab = 'focus';

  readonly tabs: DashboardTabConfig[] = [
    { id: 'focus', label: 'Focus Track' },
    { id: 'streak', label: 'Streak' },
    { id: 'planner', label: 'Planner' },
    { id: 'participation', label: 'Participation Tool' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') as DashboardTab | null;

    if (tab && this.tabs.some((item) => item.id === tab)) {
      this.activeTab = tab;
    }
  }

  setActiveTab(tab: DashboardTab): void {
    this.activeTab = tab;
  }

  isActiveTab(tab: DashboardTab): boolean {
    return this.activeTab === tab;
  }
}
