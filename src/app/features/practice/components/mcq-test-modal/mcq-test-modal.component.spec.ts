import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MCQTestModalComponent } from './mcq-test-modal.component';
import { MCQQuestion, SkillAssessment, MCQOption } from '../../services/practice.service';

describe('MCQTestModalComponent', () => {
  let component: MCQTestModalComponent;
  let fixture: ComponentFixture<MCQTestModalComponent>;
  let mockDialogRef: any;

  const mockMCQQuestions: MCQQuestion[] = [
    {
      id: '1',
      topic: 'Test Topic',
      question: 'What is 2 + 2?',
      options: [
        { id: 'a', text: '3', isCorrect: false },
        { id: 'b', text: '4', isCorrect: true },
        { id: 'c', text: '5', isCorrect: false },
        { id: 'd', text: '6', isCorrect: false }
      ],
      explanation: 'The sum of 2 and 2 is 4',
      difficulty: 'easy'
    }
  ];

  const mockAssessment: SkillAssessment = {
    id: '1',
    title: 'Test Assessment',
    description: 'Test Description',
    topic: 'Test Topic',
    questions: 1,
    duration: 10,
    level: 'beginner',
    passingScore: 70
  };

  beforeEach(async () => {
    mockDialogRef = { 
      close: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [MCQTestModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            assessment: mockAssessment,
            questions: mockMCQQuestions,
            passingScore: 70,
            duration: 10
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MCQTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with first question', () => {
    expect(component.currentQuestion).toBe(mockMCQQuestions[0]);
    expect(component.currentQuestionIndex).toBe(0);
  });

  it('should select answer', () => {
    const option = mockMCQQuestions[0].options[1];
    component.selectAnswer(option);
    expect(component.selectedAnswers[mockMCQQuestions[0].id]).toBe(option.id);
  });

  it('should check if answer is selected', () => {
    const option = mockMCQQuestions[0].options[1];
    component.selectAnswer(option);
    expect(component.isAnswerSelected(option)).toBe(true);
  });

  it('should navigate to next question', () => {
    component.questions = mockMCQQuestions;
    component.questions.push({
      id: '2',
      topic: 'Test Topic',
      question: 'What is 3 + 3?',
      options: [
        { id: 'a', text: '5', isCorrect: false },
        { id: 'b', text: '6', isCorrect: true },
        { id: 'c', text: '7', isCorrect: false },
        { id: 'd', text: '8', isCorrect: false }
      ],
      explanation: 'The sum of 3 and 3 is 6',
      difficulty: 'easy'
    });

    component.nextQuestion();
    expect(component.currentQuestionIndex).toBe(1);
  });

  it('should navigate to previous question', () => {
    component.questions = mockMCQQuestions;
    component.questions.push({
      id: '2',
      topic: 'Test Topic',
      question: 'What is 3 + 3?',
      options: [
        { id: 'a', text: '5', isCorrect: false },
        { id: 'b', text: '6', isCorrect: true },
        { id: 'c', text: '7', isCorrect: false },
        { id: 'd', text: '8', isCorrect: false }
      ],
      explanation: 'The sum of 3 and 3 is 6',
      difficulty: 'easy'
    });

    component.currentQuestionIndex = 1;
    component.previousQuestion();
    expect(component.currentQuestionIndex).toBe(0);
  });

  it('should calculate progress percentage', () => {
    component.questions = mockMCQQuestions;
    component.currentQuestionIndex = 0;
    expect(component.getProgressPercentage()).toBe(100);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(65)).toBe('1:05');
    expect(component.formatTime(305)).toBe('5:05');
    expect(component.formatTime(5)).toBe('0:05');
  });

  it('should submit test and calculate score', () => {
    component.questions = mockMCQQuestions;
    component.selectedAnswers = { '1': 'b' }; // Correct answer
    component.submitTest();

    expect(component.showResults).toBe(true);
    expect(component.testResult.correctAnswers).toBe(1);
    expect(component.testResult.score).toBe(100);
    expect(component.testResult.passed).toBe(true);
  });

  it('should fail test when score is below passing score', () => {
    component.questions = mockMCQQuestions;
    component.selectedAnswers = { '1': 'a' }; // Incorrect answer
    component.submitTest();

    expect(component.showResults).toBe(true);
    expect(component.testResult.correctAnswers).toBe(0);
    expect(component.testResult.score).toBe(0);
    expect(component.testResult.passed).toBe(false);
  });

  it('should close dialog', () => {
    let closeWasCalled = false;
    mockDialogRef.close = () => {
      closeWasCalled = true;
    };
    component.closeDialog();
    expect(closeWasCalled).toBe(true);
  });

  it('should retake test', () => {
    component.showResults = true;
    component.selectedAnswers = { '1': 'a' };
    component.retakeTest();

    expect(component.showResults).toBe(false);
    expect(component.currentQuestionIndex).toBe(0);
    expect(Object.keys(component.selectedAnswers).length).toBe(0);
  });
});
