import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypingComponent } from './typing';

describe('TypingComponent', () => {
  let component: TypingComponent;
  let fixture: ComponentFixture<TypingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have lessons loaded', () => {
    expect(component.lessons.length).toBeGreaterThan(0);
  });

  it('should select a lesson', () => {
    const lesson = component.lessons[0];
    component.selectLesson(lesson);
    expect(component.selectedLesson).toBe(lesson);
    expect(component.isTypingMode).toBe(true);
  });

  it('should reset lesson', () => {
    component.resetLesson();
    expect(component.isTypingMode).toBe(false);
    expect(component.userInput).toBe('');
  });
});
