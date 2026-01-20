import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { AssessComponent } from './assess';

describe('AssessComponent', () => {
  let component: AssessComponent;
  let fixture: ComponentFixture<AssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessComponent, MatCardModule, MatButtonModule, MatProgressBarModule, MatIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render assessment center title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Assessment Center');
  });

  it('should render stat cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statCards = compiled.querySelectorAll('.stat-card');
    expect(statCards.length).toBe(3);
  });

  it('should render assessment items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const assessmentItems = compiled.querySelectorAll('.assessment-item');
    expect(assessmentItems.length).toBe(3);
  });

  it('should have assessment buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button[color="primary"]');
    expect(buttons.length).toBe(3);
  });

  it('should display difficulty badges', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const difficulties = compiled.querySelectorAll('.difficulty');
    expect(difficulties.length).toBe(3);
  });

  it('should have progress bars', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const progressBars = compiled.querySelectorAll('mat-progress-bar');
    expect(progressBars.length).toBe(3);
  });
});