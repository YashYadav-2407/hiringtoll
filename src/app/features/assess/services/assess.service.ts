import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AssessmentOverview {
  completedCount: number;
  averageScore: number;
  averageTime: string;
  totalAttempts: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'hard' | 'expert';
  duration: number; // in minutes
  questionCount: number;
  category: string;
  progress: number; // 0-100
  passingScore: number; // percentage
  lastAttempted?: string;
  bestScore?: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  title: string;
  score: number;
  percentage: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  duration: number; // in minutes
  completedDate: string;
  difficulty: string;
}

export interface AssessmentDetail {
  assessment: Assessment;
  results: AssessmentResult[];
}

@Injectable({
  providedIn: 'root'
})
export class AssessService {
  constructor(private http: HttpClient) {}

  /**
   * Get assessment overview stats
   */
  getAssessmentOverview(): Observable<AssessmentOverview> {
    const overview: AssessmentOverview = {
      completedCount: 5,
      averageScore: 85,
      averageTime: '2h 30m',
      totalAttempts: 12
    };
    return of(overview).pipe(
      catchError(error => {
        console.error('Error fetching assessment overview:', error);
        return of(overview);
      })
    );
  }

  /**
   * Get all available assessments
   */
  getAllAssessments(): Observable<Assessment[]> {
    const assessments: Assessment[] = [
      {
        id: '1',
        title: 'Full-Stack Developer Assessment',
        description: 'Comprehensive test covering frontend, backend, and database skills',
        difficulty: 'expert',
        duration: 180,
        questionCount: 50,
        category: 'Full Stack',
        progress: 0,
        passingScore: 70,
        bestScore: 88,
        lastAttempted: '2025-01-15'
      },
      {
        id: '2',
        title: 'Algorithm & Data Structures',
        description: 'Test your problem-solving skills with complex algorithmic challenges',
        difficulty: 'hard',
        duration: 120,
        questionCount: 25,
        category: 'Algorithms',
        progress: 0,
        passingScore: 75,
        bestScore: 92,
        lastAttempted: '2025-01-10'
      },
      {
        id: '3',
        title: 'System Design Interview',
        description: 'Practice designing scalable systems and architectures',
        difficulty: 'hard',
        duration: 90,
        questionCount: 10,
        category: 'System Design',
        progress: 0,
        passingScore: 70,
        bestScore: 85,
        lastAttempted: '2025-01-20'
      },
      {
        id: '4',
        title: 'Front-End Development',
        description: 'HTML, CSS, JavaScript, React, and modern web technologies',
        difficulty: 'intermediate',
        duration: 90,
        questionCount: 30,
        category: 'Frontend',
        progress: 0,
        passingScore: 70,
        bestScore: 91,
        lastAttempted: '2025-01-08'
      },
      {
        id: '5',
        title: 'Backend Development',
        description: 'APIs, databases, authentication, and server-side architecture',
        difficulty: 'intermediate',
        duration: 120,
        questionCount: 35,
        category: 'Backend',
        progress: 0,
        passingScore: 72,
        bestScore: 89,
        lastAttempted: '2025-01-12'
      },
      {
        id: '6',
        title: 'Database & SQL',
        description: 'SQL queries, schema design, optimization, and database concepts',
        difficulty: 'intermediate',
        duration: 75,
        questionCount: 20,
        category: 'Database',
        progress: 0,
        passingScore: 70,
        bestScore: 87,
        lastAttempted: '2025-01-18'
      },
      {
        id: '7',
        title: 'JavaScript Mastery',
        description: 'Advanced JavaScript concepts, ES6+, and async programming',
        difficulty: 'hard',
        duration: 90,
        questionCount: 25,
        category: 'JavaScript',
        progress: 0,
        passingScore: 73,
        bestScore: 90,
        lastAttempted: '2025-01-14'
      },
      {
        id: '8',
        title: 'React Advanced',
        description: 'Hooks, state management, performance, and testing',
        difficulty: 'hard',
        duration: 100,
        questionCount: 28,
        category: 'React',
        progress: 0,
        passingScore: 75,
        bestScore: 86,
        lastAttempted: '2025-01-09'
      },
      {
        id: '9',
        title: 'Python Fundamentals',
        description: 'Core Python concepts, OOP, and common libraries',
        difficulty: 'beginner',
        duration: 60,
        questionCount: 20,
        category: 'Python',
        progress: 0,
        passingScore: 70,
        bestScore: 95,
        lastAttempted: '2025-01-19'
      },
      {
        id: '10',
        title: 'Cloud Architecture & AWS',
        description: 'Cloud computing concepts, AWS services, and deployment',
        difficulty: 'expert',
        duration: 120,
        questionCount: 40,
        category: 'Cloud',
        progress: 0,
        passingScore: 75,
        bestScore: 84,
        lastAttempted: '2025-01-11'
      }
    ];

    return of(assessments).pipe(
      catchError(error => {
        console.error('Error fetching assessments:', error);
        return of([]);
      })
    );
  }

  /**
   * Get assessment by ID with details
   */
  getAssessmentById(id: string): Observable<AssessmentDetail> {
    // Get all assessments
    const allAssessments: Assessment[] = [
      {
        id: '1',
        title: 'Full-Stack Developer Assessment',
        description: 'Comprehensive test covering frontend, backend, and database skills',
        difficulty: 'expert',
        duration: 180,
        questionCount: 50,
        category: 'Full Stack',
        progress: 0,
        passingScore: 70,
        bestScore: 88,
        lastAttempted: '2025-01-15'
      }
    ];

    const results: AssessmentResult[] = [
      {
        id: 'r1',
        assessmentId: '1',
        title: 'Full-Stack Developer Assessment',
        score: 88,
        percentage: 44,
        passed: true,
        totalQuestions: 50,
        correctAnswers: 44,
        duration: 165,
        completedDate: '2025-01-15',
        difficulty: 'expert'
      }
    ];

    const assessment = allAssessments.find(a => a.id === id);
    if (assessment) {
      const assessmentResults = results.filter(r => r.assessmentId === id);
      const assessmentDetail: AssessmentDetail = {
        assessment: assessment,
        results: assessmentResults
      };
      return of(assessmentDetail).pipe(
        catchError(error => {
          console.error('Error fetching assessment:', error);
          return of(assessmentDetail);
        })
      );
    }
    return of({ assessment: {} as Assessment, results: [] } as AssessmentDetail);
  }

  /**
   * Get assessment results history
   */
  getAssessmentResults(assessmentId?: string): Observable<AssessmentResult[]> {
    const results: AssessmentResult[] = [
      {
        id: 'r1',
        assessmentId: '1',
        title: 'Full-Stack Developer Assessment',
        score: 88,
        percentage: 44,
        passed: true,
        totalQuestions: 50,
        correctAnswers: 44,
        duration: 165,
        completedDate: '2025-01-15',
        difficulty: 'expert'
      },
      {
        id: 'r2',
        assessmentId: '2',
        title: 'Algorithm & Data Structures',
        score: 92,
        percentage: 23,
        passed: true,
        totalQuestions: 25,
        correctAnswers: 23,
        duration: 115,
        completedDate: '2025-01-10',
        difficulty: 'hard'
      },
      {
        id: 'r3',
        assessmentId: '3',
        title: 'System Design Interview',
        score: 85,
        percentage: 8.5,
        passed: true,
        totalQuestions: 10,
        correctAnswers: 8,
        duration: 88,
        completedDate: '2025-01-20',
        difficulty: 'hard'
      },
      {
        id: 'r4',
        assessmentId: '4',
        title: 'Front-End Development',
        score: 91,
        percentage: 27.3,
        passed: true,
        totalQuestions: 30,
        correctAnswers: 27,
        duration: 85,
        completedDate: '2025-01-08',
        difficulty: 'intermediate'
      },
      {
        id: 'r5',
        assessmentId: '5',
        title: 'Backend Development',
        score: 89,
        percentage: 31.4,
        passed: true,
        totalQuestions: 35,
        correctAnswers: 31,
        duration: 118,
        completedDate: '2025-01-12',
        difficulty: 'intermediate'
      }
    ];

    const filteredResults = assessmentId 
      ? results.filter(r => r.assessmentId === assessmentId)
      : results;

    return of(filteredResults).pipe(
      catchError(error => {
        console.error('Error fetching assessment results:', error);
        return of([]);
      })
    );
  }

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics(): Observable<any> {
    const analytics = {
      totalAssessments: 10,
      totalAttempts: 12,
      averageScore: 85,
      passRate: 92,
      bestScore: 95,
      weakAreas: ['System Design', 'Cloud Architecture'],
      strongAreas: ['Frontend', 'Algorithms'],
      timeSpent: 18.5, // hours
      improvementTrend: 'Up' // Up, Down, Stable
    };

    return of(analytics).pipe(
      catchError(error => {
        console.error('Error fetching analytics:', error);
        return of(analytics);
      })
    );
  }

  /**
   * Get recommended assessments based on user performance
   */
  getRecommendedAssessments(): Observable<Assessment[]> {
    const recommended: Assessment[] = [
      {
        id: '10',
        title: 'Cloud Architecture & AWS',
        description: 'Cloud computing concepts, AWS services, and deployment',
        difficulty: 'expert',
        duration: 120,
        questionCount: 40,
        category: 'Cloud',
        progress: 0,
        passingScore: 75
      },
      {
        id: '3',
        title: 'System Design Interview',
        description: 'Practice designing scalable systems and architectures',
        difficulty: 'hard',
        duration: 90,
        questionCount: 10,
        category: 'System Design',
        progress: 0,
        passingScore: 70
      }
    ];

    return of(recommended).pipe(
      catchError(error => {
        console.error('Error fetching recommended assessments:', error);
        return of([]);
      })
    );
  }

  /**
   * Get all assessment content
   */
  getAllAssessContent() {
    return {
      overview$: this.getAssessmentOverview(),
      assessments$: this.getAllAssessments(),
      results$: this.getAssessmentResults(),
      analytics$: this.getPerformanceAnalytics(),
      recommended$: this.getRecommendedAssessments()
    };
  }
}
