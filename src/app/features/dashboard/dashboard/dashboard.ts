import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header';
import { WelcomeCardComponent } from '../components/welcome-card/welcome-card';
import { FeaturedTrackComponent } from '../components/featured-track/featured-track';
import { StreakWidgetComponent } from '../components/streak-widget/streak-widget';
import { FooterComponent } from '../../../core/footer/footer';
import { CalendarTodoComponent } from '../components/calendar-todo/calendar-todo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
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
export class DashboardComponent {}
