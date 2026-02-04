import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessComponent } from './assess';
import { AssessService } from './services/assess.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import {
  AssessmentOverview,
  Assessment,
  AssessmentResult
} from './services/assess.service';

describe('AssessComponent', () => {
  let component: AssessComponent;
  let fixture: ComponentFixture<AssessComponent>;
  let service: AssessService;

  const mockOverview: AssessmentOverview = {
    completedCount: 5,
    averageScore: 85,
    averageTime: '2h 30m',
    totalAttempts: 12
  };

  const mockAssessments: Assessment[] = [
    {
      id: '1',
      title: 'Full-Stack Developer Assessment',
      description: 'Test',
      difficulty: 'expert',
      duration: 180,
      questionCount: 50,
      category: 'Full Stack',
      progress: 0,
      passingScore: 70
    }
  ];

  const mockResults: AssessmentResult[] = [
    {
      id: 'r1',
      assessmentId: '1',
      title: 'Assessment 1',
      score: 88,
      percentage: 88,
      passed: true,
      totalQuestions: 50,
      correctAnswers: 44,
      duration: 165,
      completedDate: '2025-01-15',
      difficulty: 'expert'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssessComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule
      ],
      providers: [AssessService]
    }).compileComponents();

    fixture = TestBed.createComponent(AssessComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AssessService);
  });

  it('should create the assess component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading flags initialized as true', () => {
    expect(component.overviewLoading).toBe(true);
    expect(component.assessmentsLoading).toBe(true);
    expect(component.resultsLoading).toBe(true);
    expect(component.recommendedLoading).toBe(true);
  });

  it('should have empty arrays for data', () => {
    expect(component.overview).toBeNull();
    expect(component.assessments).toEqual([]);
    expect(component.assessmentResults).toEqual([]);
    expect(component.recommendedAssessments).toEqual([]);
  });

  it('should load all data on ngOnInit', () => {
    spyOn(component, 'loadOverview');
    spyOn(component, 'loadAssessments');
    spyOn(component, 'loadResults');
    spyOn(component, 'loadRecommendedAssessments');
    
    component.ngOnInit();
    
    expect(component.loadOverview).toHaveBeenCalled();
    expect(component.loadAssessments).toHaveBeenCalled();
    expect(component.loadResults).toHaveBeenCalled();
    expect(component.loadRecommendedAssessments).toHaveBeenCalled();
  });

  it('should fetch and set overview data', (done) => {
    spyOn(service, 'getAssessmentOverview').and.returnValue(of(mockOverview));
    
    component.loadOverview();
    
    setTimeout(() => {
      expect(component.overview).toEqual(mockOverview);
      expect(component.overviewLoading).toBe(false);
      done();
    }, 100);
  });

  it('should fetch and set all assessments', (done) => {
    spyOn(service, 'getAllAssessments').and.returnValue(of(mockAssessments));
    
    component.loadAssessments();
    
    setTimeout(() => {
      expect(component.assessments).toEqual(mockAssessments);
      expect(component.assessmentsLoading).toBe(false);
      done();
    }, 100);
  });

  it('should fetch and set assessment results', (done) => {
    spyOn(service, 'getAssessmentResults').and.returnValue(of(mockResults));
    
    component.loadResults();
    
    setTimeout(() => {
      expect(component.assessmentResults).toEqual(mockResults);
      expect(component.resultsLoading).toBe(false);
      done();
    }, 100);
  });

  it('should get correct difficulty color for beginner', () => {
    const color = component.getDifficultyColor('beginner');
    expect(color).toBe('primary');
  });

  it('should get correct difficulty color for intermediate', () => {
    const color = component.getDifficultyColor('intermediate');
    expect(color).toBe('accent');
  });

  it('should get correct difficulty color for hard', () => {
    const color = component.getDifficultyColor('hard');
    expect(color).toBe('warn');
  });

  it('should get correct difficulty color for expert/default', () => {
    const color = component.getDifficultyColor('expert');
    expect(color).toBe('');
  });

  it('should format duration hours and minutes correctly', () => {
    const formatted = component.formatDuration(180);
    expect(formatted).toBe('3h 0m');
  });

  it('should format duration minutes correctly', () => {
    const formatted = component.formatDuration(45);
    expect(formatted).toBe('45m');
  });

  it('should format duration for less than an hour', () => {
    const formatted = component.formatDuration(30);
    expect(formatted).toBe('30m');
  });

  it('should call startAssessment with assessment', () => {
    const assessment = mockAssessments[0];
    spyOn(console, 'log');
    component.startAssessment(assessment);
    expect(console.log).toHaveBeenCalledWith('Starting assessment:', assessment);
  });

  it('should call retakeAssessment with result', () => {
    const result = mockResults[0];
    spyOn(console, 'log');
    component.retakeAssessment(result);
    expect(console.log).toHaveBeenCalledWith('Retaking assessment:', result);
  });

  it('should call viewResults with result', () => {
    const result = mockResults[0];
    spyOn(console, 'log');
    component.viewResults(result);
    expect(console.log).toHaveBeenCalledWith('Viewing results:', result);
  });

  it('should render assessment center header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    const title = compiled.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Assessment Center');
  });

  it('should render tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    const tabs = compiled.querySelector('mat-tab-group');
    expect(tabs).toBeTruthy();
  });
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