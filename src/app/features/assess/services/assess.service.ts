import { Injectable } from '@angular/core';
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
  private readonly ASSESSMENTS_KEY = 'assess_assessments';
  private readonly RESULTS_KEY = 'assess_results';

  private readonly seedAssessments: Assessment[] = [
    {
      id: '1',
      title: 'Full-Stack Developer Assessment',
      description: 'Comprehensive test covering frontend, backend, and database skills',
      difficulty: 'expert',
      duration: 180,
      questionCount: 50,
      category: 'Full Stack',
      progress: 0,
      passingScore: 70
    },
    {
      id: '2',
      title: 'Algorithm & Data Structures',
      description: 'Test your problem-solving skills with algorithmic challenges',
      difficulty: 'hard',
      duration: 120,
      questionCount: 25,
      category: 'Algorithms',
      progress: 0,
      passingScore: 75
    },
    {
      id: '3',
      title: 'System Design Interview',
      description: 'Design scalable systems and architecture decisions',
      difficulty: 'hard',
      duration: 90,
      questionCount: 10,
      category: 'System Design',
      progress: 0,
      passingScore: 70
    },
    {
      id: '4',
      title: 'Front-End Development',
      description: 'HTML, CSS, JavaScript, Angular/React and modern web patterns',
      difficulty: 'intermediate',
      duration: 90,
      questionCount: 30,
      category: 'Frontend',
      progress: 0,
      passingScore: 70
    },
    {
      id: '5',
      title: 'Backend Development',
      description: 'APIs, databases, authentication and server-side architecture',
      difficulty: 'intermediate',
      duration: 120,
      questionCount: 35,
      category: 'Backend',
      progress: 0,
      passingScore: 72
    },
    {
      id: '6',
      title: 'Database & SQL',
      description: 'SQL queries, schema design and optimization concepts',
      difficulty: 'intermediate',
      duration: 75,
      questionCount: 20,
      category: 'Database',
      progress: 0,
      passingScore: 70
    },
    {
      id: '7',
      title: 'JavaScript Mastery',
      description: 'Advanced JavaScript, ES6+, closures, async and performance',
      difficulty: 'hard',
      duration: 90,
      questionCount: 25,
      category: 'JavaScript',
      progress: 0,
      passingScore: 73
    },
    {
      id: '8',
      title: 'React Advanced',
      description: 'Hooks, state management, performance tuning and testing',
      difficulty: 'hard',
      duration: 100,
      questionCount: 28,
      category: 'React',
      progress: 0,
      passingScore: 75
    },
    {
      id: '9',
      title: 'Python Fundamentals',
      description: 'Core Python, OOP, data structures and common libraries',
      difficulty: 'beginner',
      duration: 60,
      questionCount: 20,
      category: 'Python',
      progress: 0,
      passingScore: 70
    },
    {
      id: '10',
      title: 'Cloud Architecture & AWS',
      description: 'Cloud design, AWS services, deployment and reliability basics',
      difficulty: 'expert',
      duration: 120,
      questionCount: 40,
      category: 'Cloud',
      progress: 0,
      passingScore: 75
    }
  ];

  private readonly seedResults: AssessmentResult[] = [
    {
      id: 'r1',
      assessmentId: '4',
      title: 'Front-End Development',
      score: 91,
      percentage: 91,
      passed: true,
      totalQuestions: 30,
      correctAnswers: 27,
      duration: 85,
      completedDate: '2025-01-08',
      difficulty: 'intermediate'
    },
    {
      id: 'r2',
      assessmentId: '2',
      title: 'Algorithm & Data Structures',
      score: 92,
      percentage: 92,
      passed: true,
      totalQuestions: 25,
      correctAnswers: 23,
      duration: 115,
      completedDate: '2025-01-10',
      difficulty: 'hard'
    },
    {
      id: 'r3',
      assessmentId: '5',
      title: 'Backend Development',
      score: 89,
      percentage: 89,
      passed: true,
      totalQuestions: 35,
      correctAnswers: 31,
      duration: 118,
      completedDate: '2025-01-12',
      difficulty: 'intermediate'
    }
  ];

  constructor() {
    this.ensureInitialized();
  }

  /**
   * Get assessment overview stats
   */
  getAssessmentOverview(): Observable<AssessmentOverview> {
    const results = this.getStoredResults();
    const uniqueCompleted = new Set(results.map(r => r.assessmentId)).size;
    const totalAttempts = results.length;
    const averageScore = totalAttempts
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts)
      : 0;
    const averageMinutes = totalAttempts
      ? Math.round(results.reduce((sum, r) => sum + r.duration, 0) / totalAttempts)
      : 0;

    const overview: AssessmentOverview = {
      completedCount: uniqueCompleted,
      averageScore,
      averageTime: this.formatMinutes(averageMinutes),
      totalAttempts
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
    const assessments = this.getStoredAssessments();

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
    const allAssessments = this.getStoredAssessments();
    const results = this.getStoredResults();

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
    const results = this.getStoredResults();

    const filteredResults = assessmentId
      ? results.filter(r => r.assessmentId === assessmentId)
      : results;

    filteredResults.sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime());

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
    const results = this.getStoredResults();
    const assessments = this.getStoredAssessments();
    const totalAttempts = results.length;
    const passCount = results.filter(r => r.passed).length;
    const averageScore = totalAttempts
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts)
      : 0;
    const bestScore = totalAttempts ? Math.max(...results.map(r => r.score)) : 0;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    const categoryScores = new Map<string, number[]>();

    results.forEach(result => {
      const category = assessments.find(a => a.id === result.assessmentId)?.category;
      if (!category) {
        return;
      }

      const list = categoryScores.get(category) || [];
      list.push(result.score);
      categoryScores.set(category, list);
    });

    const averagesByCategory = [...categoryScores.entries()]
      .map(([category, scores]) => ({
        category,
        average: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      }))
      .sort((a, b) => b.average - a.average);

    const analytics = {
      totalAssessments: assessments.length,
      totalAttempts,
      averageScore,
      passRate: totalAttempts ? Math.round((passCount / totalAttempts) * 100) : 0,
      bestScore,
      weakAreas: averagesByCategory.slice(-2).map(item => item.category),
      strongAreas: averagesByCategory.slice(0, 2).map(item => item.category),
      timeSpent: Math.round((totalDuration / 60) * 10) / 10,
      improvementTrend: this.getImprovementTrend(results)
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
    const assessments = this.getStoredAssessments();
    const results = this.getStoredResults();
    const categoryAverages = new Map<string, number>();

    assessments.forEach(a => {
      const categoryResults = results.filter(r => r.assessmentId === a.id);
      if (categoryResults.length) {
        const avg = categoryResults.reduce((sum, r) => sum + r.score, 0) / categoryResults.length;
        categoryAverages.set(a.category, avg);
      }
    });

    const recommended = assessments
      .filter(a => (a.bestScore || 0) < a.passingScore + 8)
      .sort((a, b) => {
        const aScore = categoryAverages.get(a.category) ?? 0;
        const bScore = categoryAverages.get(b.category) ?? 0;
        return aScore - bScore;
      })
      .slice(0, 3);

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

  startAssessment(assessmentId: string): Observable<AssessmentResult> {
    const assessments = this.getStoredAssessments();
    const results = this.getStoredResults();
    const target = assessments.find(a => a.id === assessmentId);

    if (!target) {
      throw new Error(`Assessment ${assessmentId} not found`);
    }

    const score = this.generateScore(target);
    const correctAnswers = Math.round((score / 100) * target.questionCount);
    const duration = this.generateDuration(target.duration);
    const completedDate = new Date().toISOString().slice(0, 10);

    const newResult: AssessmentResult = {
      id: `r-${Date.now()}`,
      assessmentId: target.id,
      title: target.title,
      score,
      percentage: score,
      passed: score >= target.passingScore,
      totalQuestions: target.questionCount,
      correctAnswers,
      duration,
      completedDate,
      difficulty: target.difficulty
    };

    results.unshift(newResult);
    this.setStoredResults(results);

    target.lastAttempted = completedDate;
    target.bestScore = Math.max(target.bestScore || 0, score);
    target.progress = 100;
    this.setStoredAssessments(assessments);

    return of(newResult);
  }

  retakeAssessment(assessmentId: string): Observable<AssessmentResult> {
    return this.startAssessment(assessmentId);
  }

  private ensureInitialized(): void {
    const existingAssessments = this.readStorage<Assessment[]>(this.ASSESSMENTS_KEY);
    const existingResults = this.readStorage<AssessmentResult[]>(this.RESULTS_KEY);

    if (!existingAssessments || !Array.isArray(existingAssessments) || existingAssessments.length === 0) {
      this.setStoredAssessments(this.seedAssessments.map(a => ({ ...a })));
    }

    if (!existingResults || !Array.isArray(existingResults) || existingResults.length === 0) {
      this.setStoredResults(this.seedResults.map(r => ({ ...r })));
      const assessments = this.getStoredAssessments();
      const byId = new Map<string, Assessment>();
      assessments.forEach(a => byId.set(a.id, a));
      this.seedResults.forEach(result => {
        const current = byId.get(result.assessmentId);
        if (current) {
          current.bestScore = Math.max(current.bestScore || 0, result.score);
          current.lastAttempted = result.completedDate;
          current.progress = 100;
        }
      });
      this.setStoredAssessments(assessments);
    }
  }

  private getStoredAssessments(): Assessment[] {
    const assessments = this.readStorage<Assessment[]>(this.ASSESSMENTS_KEY);
    return Array.isArray(assessments) ? assessments : [];
  }

  private setStoredAssessments(assessments: Assessment[]): void {
    this.writeStorage(this.ASSESSMENTS_KEY, assessments);
  }

  private getStoredResults(): AssessmentResult[] {
    const results = this.readStorage<AssessmentResult[]>(this.RESULTS_KEY);
    return Array.isArray(results) ? results : [];
  }

  private setStoredResults(results: AssessmentResult[]): void {
    this.writeStorage(this.RESULTS_KEY, results);
  }

  private readStorage<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  private writeStorage(key: string, value: unknown): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }

  private formatMinutes(minutes: number): string {
    if (!minutes) {
      return '0m';
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (!hours) {
      return `${mins}m`;
    }
    if (!mins) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
  }

  private generateScore(assessment: Assessment): number {
    const baseByDifficulty: Record<Assessment['difficulty'], number> = {
      beginner: 78,
      intermediate: 74,
      hard: 70,
      expert: 66
    };

    const baseline = baseByDifficulty[assessment.difficulty] || 70;
    const variance = Math.floor(Math.random() * 31) - 15;
    return Math.max(45, Math.min(98, baseline + variance));
  }

  private generateDuration(targetDuration: number): number {
    const variance = Math.floor(Math.random() * 21) - 10;
    return Math.max(15, targetDuration + variance);
  }

  private getImprovementTrend(results: AssessmentResult[]): 'Up' | 'Down' | 'Stable' {
    if (results.length < 4) {
      return 'Stable';
    }

    const recent = results.slice(0, 3).reduce((sum, r) => sum + r.score, 0) / 3;
    const previous = results.slice(3, 6).reduce((sum, r) => sum + r.score, 0) / Math.min(3, Math.max(results.length - 3, 1));

    if (recent - previous >= 4) {
      return 'Up';
    }
    if (previous - recent >= 4) {
      return 'Down';
    }
    return 'Stable';
  }
}
