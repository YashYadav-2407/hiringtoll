import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { LearnComponent } from './learn';

describe('LearnComponent', () => {
  let component: LearnComponent;
  let fixture: ComponentFixture<LearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnComponent, MatCardModule, MatButtonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render learning center title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Learning Center');
  });

  it('should render learning sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('.section');
    expect(sections.length).toBe(3);
  });

  it('should have start learning button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[color="primary"]');
    expect(button?.textContent?.trim()).toBe('Start Learning');
  });
});