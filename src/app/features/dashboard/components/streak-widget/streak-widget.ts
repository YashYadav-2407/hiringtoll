import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../../../core/services/todo.service';

@Component({
  selector: 'app-streak-widget',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './streak-widget.html',
  styleUrl: './streak-widget.scss'
})
export class StreakWidgetComponent {
  streak = 0;
  target = 5;

  constructor(private todoService: TodoService) {
    this.calculate();
  }

  get progressPercentage(): number {
    return Math.min((this.streak / this.target) * 100, 100);
  }

  calculate() {
    let count = 0;
    const d = new Date();

    while (true) {
      const key = d.toISOString().split('T')[0];
      if (this.todoService.hasCompletedTask(key)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    this.streak = count;
  }

  logProgress() {
    // This could be implemented to mark today's task as completed
    // For now, just recalculate the streak
    this.calculate();
  }
}
