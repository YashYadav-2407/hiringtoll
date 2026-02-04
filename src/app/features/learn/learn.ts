import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LearnService, Tutorial, Challenge, Documentation } from './services/learn.service';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './learn.html',
  styleUrl: './learn.scss'
})
export class LearnComponent implements OnInit {
  tutorials: Tutorial[] = [];
  challenges: Challenge[] = [];
  documentation: Documentation[] = [];
  
  isLoadingTutorials = false;
  isLoadingChallenges = false;
  isLoadingDocumentation = false;

  constructor(private learnService: LearnService) {}

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent(): void {
    this.loadTutorials();
    this.loadChallenges();
    this.loadDocumentation();
  }

  loadTutorials(): void {
    this.isLoadingTutorials = true;
    this.learnService.getTutorials().subscribe({
      next: (data) => {
        this.tutorials = data;
        this.isLoadingTutorials = false;
      },
      error: (error) => {
        console.error('Error loading tutorials:', error);
        this.isLoadingTutorials = false;
      }
    });
  }

  loadChallenges(): void {
    this.isLoadingChallenges = true;
    this.learnService.getChallenges().subscribe({
      next: (data) => {
        this.challenges = data;
        this.isLoadingChallenges = false;
      },
      error: (error) => {
        console.error('Error loading challenges:', error);
        this.isLoadingChallenges = false;
      }
    });
  }

  loadDocumentation(): void {
    this.isLoadingDocumentation = true;
    this.learnService.getDocumentation().subscribe({
      next: (data) => {
        this.documentation = data;
        this.isLoadingDocumentation = false;
      },
      error: (error) => {
        console.error('Error loading documentation:', error);
        this.isLoadingDocumentation = false;
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

  openLink(url?: string, newWindow: boolean = true): void {
    if (url) {
      window.open(url, newWindow ? '_blank' : '_self');
    }
  }
}