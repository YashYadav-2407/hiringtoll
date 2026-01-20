import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';

import { CalendarTodoComponent } from './calendar-todo';

describe('CalendarTodoComponent', () => {
  let component: CalendarTodoComponent;
  let fixture: ComponentFixture<CalendarTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTodoComponent, MatNativeDateModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarTodoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

if (typeof localStorage !== 'undefined') {
  // Use localStorage
}
