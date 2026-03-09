import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header';
import { WelcomeCardComponent } from '../components/welcome-card/welcome-card';
import { FeaturedTrackComponent } from '../components/featured-track/featured-track';
import { StreakWidgetComponent } from '../components/streak-widget/streak-widget';
import { FooterComponent } from '../../../core/footer/footer';
import { CalendarTodoComponent } from '../components/calendar-todo/calendar-todo';

type DashboardTab = 'focus' | 'streak' | 'planner';

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

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  activeTab: DashboardTab = 'focus';

  readonly tabs: DashboardTabConfig[] = [
    { id: 'focus', label: 'Focus Track' },
    { id: 'streak', label: 'Streak' },
    { id: 'planner', label: 'Planner' }
  ];

  setActiveTab(tab: DashboardTab): void {
    this.activeTab = tab;
  }

  isActiveTab(tab: DashboardTab): boolean {
    return this.activeTab === tab;
  }
}
