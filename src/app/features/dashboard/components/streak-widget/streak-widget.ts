import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from '../../../../core/services/todo.service';

interface StreakData {
  loginDates: string[];
  currentStreak: number;
  bestStreak: number;
  lastLoginDate: string | null;
}

@Component({
  selector: 'app-streak-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatTooltipModule, MatIconModule],
  templateUrl: './streak-widget.html',
  styleUrl: './streak-widget.scss'
})
export class StreakWidgetComponent implements OnInit {
  streak = 0;
  bestStreak = 0;
  target = 365;
  lastLoginDate: string | null = null;
  isLoggedInToday = false;
  private readonly LOGIN_DATA_KEY = 'streak_login_data';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.initializeStreakData();
    this.calculateStreak();
  }

  private initializeStreakData() {
    const today = this.getDateString(new Date());
    const data = this.getStreakData();
    
    // If today's date is not in login dates, add it
    if (!data.loginDates.includes(today)) {
      data.loginDates.push(today);
    }
    
    data.lastLoginDate = today;
    this.saveStreakData(data);
  }

  private getStreakData(): StreakData {
    const data = localStorage.getItem(this.LOGIN_DATA_KEY);
    return data ? JSON.parse(data) : {
      loginDates: [],
      currentStreak: 0,
      bestStreak: 0,
      lastLoginDate: null
    };
  }

  private saveStreakData(data: StreakData) {
    localStorage.setItem(this.LOGIN_DATA_KEY, JSON.stringify(data));
  }

  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  get progressPercentage(): number {
    return Math.min((this.streak / this.target) * 100, 100);
  }

  calculateStreak() {
    const data = this.getStreakData();
    const loginDates = data.loginDates.sort();
    const today = this.getDateString(new Date());
    
    this.isLoggedInToday = loginDates.includes(today);
    this.lastLoginDate = data.lastLoginDate;

    if (loginDates.length === 0) {
      this.streak = 0;
      this.bestStreak = data.bestStreak;
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check from today backwards
    for (let i = 0; i < 365; i++) {
      const dateStr = this.getDateString(currentDate);
      if (loginDates.includes(dateStr)) {
        currentStreak++;
      } else if (i === 0) {
        // Today is not logged in, check if yesterday has a break
        break;
      } else {
        break;
      }
      currentDate = this.addDays(currentDate, -1);
    }

    this.streak = currentStreak;
    
    // Update best streak if current is higher
    if (this.streak > data.bestStreak) {
      data.bestStreak = this.streak;
      this.saveStreakData(data);
    }
    
    this.bestStreak = data.bestStreak;
  }

  logProgress() {
    const today = this.getDateString(new Date());
    const data = this.getStreakData();
    
    if (!data.loginDates.includes(today)) {
      data.loginDates.push(today);
      data.lastLoginDate = today;
      this.saveStreakData(data);
    }
    
    this.calculateStreak();
  }

  resetStreak() {
    if (confirm('Are you sure you want to reset your streak? This action cannot be undone.')) {
      const data = this.getStreakData();
      data.loginDates = [];
      data.currentStreak = 0;
      data.lastLoginDate = null;
      this.saveStreakData(data);
      this.calculateStreak();
    }
  }
}
