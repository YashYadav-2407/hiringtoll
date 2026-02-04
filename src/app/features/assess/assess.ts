import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AssessService, Assessment, AssessmentResult, AssessmentOverview } from './services/assess.service';

@Component({
  selector: 'app-assess',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './assess.html',
  styleUrl: './assess.scss'
})
export class AssessComponent implements OnInit {
  assessments: Assessment[] = [];
  assessmentResults: AssessmentResult[] = [];
  overview: AssessmentOverview | null = null;
  recommendedAssessments: Assessment[] = [];

  isLoadingOverview = false;
  isLoadingAssessments = false;
  isLoadingResults = false;
  isLoadingRecommended = false;

  constructor(private assessService: AssessService) {}

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent(): void {
    this.loadOverview();
    this.loadAssessments();
    this.loadResults();
    this.loadRecommendedAssessments();
  }

  loadOverview(): void {
    this.isLoadingOverview = true;
    this.assessService.getAssessmentOverview().subscribe({
      next: (data) => {
        this.overview = data;
        this.isLoadingOverview = false;
      },
      error: (error) => {
        console.error('Error loading overview:', error);
        this.isLoadingOverview = false;
      }
    });
  }

  loadAssessments(): void {
    this.isLoadingAssessments = true;
    this.assessService.getAllAssessments().subscribe({
      next: (data) => {
        this.assessments = data;
        this.isLoadingAssessments = false;
      },
      error: (error) => {
        console.error('Error loading assessments:', error);
        this.isLoadingAssessments = false;
      }
    });
  }

  loadResults(): void {
    this.isLoadingResults = true;
    this.assessService.getAssessmentResults().subscribe({
      next: (data) => {
        this.assessmentResults = data;
        this.isLoadingResults = false;
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.isLoadingResults = false;
      }
    });
  }

  loadRecommendedAssessments(): void {
    this.isLoadingRecommended = true;
    this.assessService.getRecommendedAssessments().subscribe({
      next: (data) => {
        this.recommendedAssessments = data;
        this.isLoadingRecommended = false;
      },
      error: (error) => {
        console.error('Error loading recommended assessments:', error);
        this.isLoadingRecommended = false;
      }
    });
  }

  getDifficultyColor(difficulty: string): string {
    const colors: { [key: string]: string } = {
      beginner: 'success',
      intermediate: 'warn',
      hard: 'danger',
      expert: 'danger'
    };
    return colors[difficulty] || 'primary';
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  startAssessment(assessment: Assessment): void {
    console.log('Starting assessment:', assessment.title);
    // This will be integrated with the test modal similar to practice component
  }

  retakeAssessment(result: AssessmentResult): void {
    console.log('Retaking assessment:', result.title);
    // This will be integrated with the test modal
  }

  viewResults(result: AssessmentResult): void {
    console.log('Viewing results for:', result.title);
    // This will open a detailed results view
  }
}
