import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssessService } from './assess.service';

describe('AssessService', () => {
  let service: AssessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssessService]
    });

    service = TestBed.inject(AssessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch assessment overview', (done: any) => {
    service.getAssessmentOverview().subscribe((overview) => {
      expect(overview).toHaveProperty('completedCount');
      expect(overview).toHaveProperty('averageScore');
      expect(overview).toHaveProperty('averageTime');
      done();
    });
  });

  it('should fetch all assessments', (done: any) => {
    service.getAllAssessments().subscribe((assessments) => {
      expect(assessments.length).toBeGreaterThan(0);
      expect(assessments[0]).toHaveProperty('title');
      expect(assessments[0]).toHaveProperty('difficulty');
      done();
    });
  });

  it('should fetch assessment by ID', (done: any) => {
    service.getAssessmentById('1').subscribe((detail) => {
      expect(detail).toHaveProperty('assessment');
      expect(detail).toHaveProperty('results');
      done();
    });
  });

  it('should fetch assessment results', (done: any) => {
    service.getAssessmentResults().subscribe((results) => {
      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('score');
        expect(results[0]).toHaveProperty('passed');
      }
      done();
    });
  });

  it('should fetch performance analytics', (done: any) => {
    service.getPerformanceAnalytics().subscribe((analytics) => {
      expect(analytics).toHaveProperty('averageScore');
      expect(analytics).toHaveProperty('passRate');
      done();
    });
  });

  it('should fetch recommended assessments', (done: any) => {
    service.getRecommendedAssessments().subscribe((assessments) => {
      expect(Array.isArray(assessments)).toBe(true);
      done();
    });
  });

  it('should return all assess content', () => {
    const allContent = service.getAllAssessContent();
    expect(allContent).toHaveProperty('overview$');
    expect(allContent).toHaveProperty('assessments$');
    expect(allContent).toHaveProperty('results$');
    expect(allContent).toHaveProperty('analytics$');
    expect(allContent).toHaveProperty('recommended$');
  });
});
