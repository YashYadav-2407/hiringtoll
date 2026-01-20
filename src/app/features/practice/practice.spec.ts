import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PracticeComponent } from './practice';

describe('PracticeComponent', () => {
  let component: PracticeComponent;
  let fixture: ComponentFixture<PracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeComponent, MatCardModule, MatButtonModule, MatIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render practice arena title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Practice Arena');
  });

  it('should render challenge cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const challengeCards = compiled.querySelectorAll('.challenge-card');
    expect(challengeCards.length).toBe(4);
  });

  it('should have challenge buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button[mat-stroked-button]');
    expect(buttons.length).toBe(4);
  });

  it('should display challenge icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('mat-icon');
    expect(icons.length).toBe(4);
  });
});