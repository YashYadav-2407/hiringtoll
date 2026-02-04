import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { PracticeService, AlgorithmChallenge, BeginnerExercise, SpeedCoding, SkillAssessment, MCQQuestion, TestResult } from './services/practice.service';
import { MCQTestModalComponent } from './components/mcq-test-modal/mcq-test-modal.component';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatRadioModule,
    MatProgressBarModule,
    FormsModule
  ],
  templateUrl: './practice.html',
  styleUrl: './practice.scss'
})
export class PracticeComponent implements OnInit {
  algorithmChallenges: AlgorithmChallenge[] = [];
  beginnerExercises: BeginnerExercise[] = [];
  speedCodingChallenges: SpeedCoding[] = [];
  skillAssessments: SkillAssessment[] = [];

  isLoadingAlgorithm = false;
  isLoadingBeginner = false;
  isLoadingSpeed = false;
  isLoadingAssessment = false;

  constructor(
    private practiceService: PracticeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent(): void {
    this.loadAlgorithmChallenges();
    this.loadBeginnerExercises();
    this.loadSpeedCoding();
    this.loadSkillAssessments();
  }

  loadAlgorithmChallenges(): void {
    this.isLoadingAlgorithm = true;
    this.practiceService.getAlgorithmChallenges().subscribe({
      next: (data) => {
        this.algorithmChallenges = data;
        this.isLoadingAlgorithm = false;
      },
      error: (error) => {
        console.error('Error loading algorithm challenges:', error);
        this.isLoadingAlgorithm = false;
      }
    });
  }

  loadBeginnerExercises(): void {
    this.isLoadingBeginner = true;
    this.practiceService.getBeginnerExercises().subscribe({
      next: (data) => {
        this.beginnerExercises = data;
        this.isLoadingBeginner = false;
      },
      error: (error) => {
        console.error('Error loading beginner exercises:', error);
        this.isLoadingBeginner = false;
      }
    });
  }

  loadSpeedCoding(): void {
    this.isLoadingSpeed = true;
    this.practiceService.getSpeedCoding().subscribe({
      next: (data) => {
        this.speedCodingChallenges = data;
        this.isLoadingSpeed = false;
      },
      error: (error) => {
        console.error('Error loading speed coding:', error);
        this.isLoadingSpeed = false;
      }
    });
  }

  loadSkillAssessments(): void {
    this.isLoadingAssessment = true;
    this.practiceService.getSkillAssessments().subscribe({
      next: (data) => {
        this.skillAssessments = data;
        this.isLoadingAssessment = false;
      },
      error: (error) => {
        console.error('Error loading skill assessments:', error);
        this.isLoadingAssessment = false;
      }
    });
  }

  getDifficultyColor(difficulty: string): string {
    const colors: { [key: string]: string } = {
      beginner: 'success',
      easy: 'success',
      intermediate: 'warn',
      medium: 'warn',
      advanced: 'warn',
      hard: 'danger'
    };
    return colors[difficulty] || 'primary';
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      beginner: 'success',
      intermediate: 'warn',
      advanced: 'danger'
    };
    return colors[level] || 'primary';
  }

  openChallenge(url?: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  takeTest(assessment: SkillAssessment): void {
    // Load MCQ questions for this topic
    this.practiceService.getSkillAssessmentQuestions(assessment.topic).subscribe({
      next: (questions: MCQQuestion[]) => {
        // Open MCQ test modal
        const dialogRef = this.dialog.open(MCQTestModalComponent, {
          width: '90%',
          maxWidth: '900px',
          data: {
            assessment,
            questions,
            passingScore: assessment.passingScore,
            duration: assessment.duration
          }
        });

        dialogRef.afterClosed().subscribe((result: TestResult | undefined) => {
          if (result) {
            console.log('Test completed:', result);
            // You can handle test results here (save to database, show results modal, etc.)
          }
        });
      },
      error: (error) => {
        console.error('Error loading MCQ questions:', error);
      }
    });
  }
}