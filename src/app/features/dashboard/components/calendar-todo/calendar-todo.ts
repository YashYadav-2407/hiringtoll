import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TodoService, Todo } from '../../../../core/services/todo.service';

@Component({
  selector: 'app-calendar-todo',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './calendar-todo.html',
  styleUrl: './calendar-todo.scss'
})
export class CalendarTodoComponent {
  selectedDate = new Date();
  newTodo = '';
  editingId: string | null = null;

  constructor(public todoService: TodoService) {}

  get dateKey(): string {
    return this.selectedDate.toISOString().split('T')[0];
  }

  get todos(): Todo[] {
    return this.todoService.getByDate(this.dateKey);
  }

  onDateChange(date: Date | null) {
    if (date) {
      this.selectedDate = date;
      this.editingId = null;
      this.newTodo = '';
    }
  }

  addOrSave() {
    if (!this.newTodo.trim()) return;

    if (this.editingId) {
      this.todoService.update(this.editingId, this.newTodo);
      this.editingId = null;
    } else {
      this.todoService.add(this.dateKey, this.newTodo);
    }

    this.newTodo = '';
  }

  edit(todo: Todo) {
    this.newTodo = todo.text;
    this.editingId = todo.id;
  }

  dateClass = (d: Date) => {
    const key = d.toISOString().split('T')[0];
    return this.todoService.hasCompletedTask(key)
      ? 'task-day'
      : '';
  };
}
