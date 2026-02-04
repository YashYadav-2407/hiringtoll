import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PracticeService } from './practice.service';

describe('PracticeService', () => {
  let service: PracticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PracticeService]
    });

    service = TestBed.inject(PracticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch algorithm challenges', (done: any) => {
    service.getAlgorithmChallenges().subscribe((challenges) => {
      expect(challenges.length).toBe(50);
      expect(challenges[0]).toHaveProperty('title');
      expect(challenges[0]).toHaveProperty('difficulty');
      done();
    });
  });

  it('should fetch beginner exercises', (done: any) => {
    service.getBeginnerExercises().subscribe((exercises) => {
      expect(exercises.length).toBe(40);
      expect(exercises[0]).toHaveProperty('title');
      expect(exercises[0]).toHaveProperty('topic');
      done();
    });
  });

  it('should fetch speed coding challenges', (done: any) => {
    service.getSpeedCoding().subscribe((challenges) => {
      expect(challenges.length).toBe(30);
      expect(challenges[0]).toHaveProperty('title');
      expect(challenges[0]).toHaveProperty('timeLimit');
      done();
    });
  });

  it('should fetch skill assessments', (done: any) => {
    service.getSkillAssessments().subscribe((assessments) => {
      expect(assessments.length).toBe(15);
      expect(assessments[0]).toHaveProperty('title');
      expect(assessments[0]).toHaveProperty('questions');
      done();
    });
  });

  it('should return all practice content', () => {
    const allContent = service.getAllPracticeContent();
    expect(allContent).toHaveProperty('algorithmChallenges$');
    expect(allContent).toHaveProperty('beginnerExercises$');
    expect(allContent).toHaveProperty('speedCoding$');
    expect(allContent).toHaveProperty('skillAssessments$');
  });

  it('should fetch MCQ questions for a topic', (done: any) => {
    service.getSkillAssessmentQuestions('Python').subscribe((questions) => {
      expect(questions.length).toBeGreaterThan(0);
      expect(questions[0]).toHaveProperty('question');
      expect(questions[0]).toHaveProperty('options');
      expect(questions[0]).toHaveProperty('explanation');
      done();
    });
  });

  it('should return MCQ questions with correct structure', (done: any) => {
    service.getSkillAssessmentQuestions('JavaScript').subscribe((questions) => {
      const question = questions[0];
      expect(question.options.length).toBeGreaterThan(0);
      expect(question.options[0]).toHaveProperty('id');
      expect(question.options[0]).toHaveProperty('text');
      expect(question.options[0]).toHaveProperty('isCorrect');
      done();
    });
  });

  it('should return empty array for non-existent topic', (done: any) => {
    service.getSkillAssessmentQuestions('NonExistent').subscribe((questions) => {
      expect(questions.length).toBe(0);
      done();
    });
  });
});
