import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Todo {
  id: string;
  date: string; // yyyy-mm-dd
  text: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>(this.load());

  private load(): Todo[] {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('todos') || '[]');
    }
    return [];
  }

  private save(todos: Todo[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    this.todos$.next(todos);
  }

  getByDate(date: string): Todo[] {
    return this.todos$.value.filter(t => t.date === date);
  }

  add(date: string, text: string) {
    this.save([
      ...this.todos$.value,
      { id: crypto.randomUUID(), date, text, completed: false }
    ]);
  }

  update(id: string, text: string) {
    this.save(this.todos$.value.map(t =>
      t.id === id ? { ...t, text } : t
    ));
  }

  delete(id: string) {
    this.save(this.todos$.value.filter(t => t.id !== id));
  }

  toggle(id: string) {
    this.save(this.todos$.value.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }

  hasCompletedTask(date: string): boolean {
    return this.todos$.value.some(
      t => t.date === date && t.completed
    );
  }
}
