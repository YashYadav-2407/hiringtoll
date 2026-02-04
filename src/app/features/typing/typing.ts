import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface TypingLesson {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  excerpt: string;
}

interface RaceState {
  playerProgress: number;
  opponentProgress: number;
  gameOver: boolean;
  playerWon: boolean;
  startTime: number;
}

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './typing.html',
  styleUrl: './typing.scss',
})
export class TypingComponent {
  selectedLesson: TypingLesson | null = null;
  isTypingMode = false;
  isRaceMode = false;
  userInput = '';
  currentLessonIndex = 0;
  accuracy = 0;
  wpm = 0;
  raceState: RaceState = {
    playerProgress: 0,
    opponentProgress: 0,
    gameOver: false,
    playerWon: false,
    startTime: 0,
  };
  private raceInterval: any;
  opponentSpeed = 0.5; // Adjustable opponent difficulty

  lessons: TypingLesson[] = [
    {
      id: 1,
      title: 'Basic Keys - Home Row',
      description: 'Learn the home row keys: A, S, D, F, J, K, L, Semicolon',
      difficulty: 'beginner',
      duration: 5,
      excerpt: 'a s d f f j k l ; a s d f f j k l ;',
    },
    {
      id: 2,
      title: 'Number Keys',
      description: 'Master typing numbers 1-10 efficiently',
      difficulty: 'beginner',
      duration: 5,
      excerpt: '1 2 3 4 5 6 7 8 9 0 1 2 3 4 5',
    },
    {
      id: 3,
      title: 'Common Punctuation',
      description:
        'Practice typing punctuation marks: period, comma, question mark, exclamation',
      difficulty: 'intermediate',
      duration: 10,
      excerpt:
        'hello, world! how are you? this is a test. punctuation matters!',
    },
    {
      id: 4,
      title: 'JavaScript Syntax',
      description: 'Type JavaScript code snippets and syntax patterns',
      difficulty: 'intermediate',
      duration: 10,
      excerpt: 'const x = 10; function test() { return x; }',
    },
    {
      id: 5,
      title: 'HTML Elements',
      description: 'Practice typing HTML tags and elements',
      difficulty: 'advanced',
      duration: 15,
      excerpt:
        '<div class="container"><h1>Title</h1><p>Content here</p></div>',
    },
    {
      id: 6,
      title: 'CSS Properties',
      description: 'Type CSS properties and values',
      difficulty: 'advanced',
      duration: 15,
      excerpt:
        'display: flex; justify-content: center; align-items: center; color: #333;',
    },
  ];

  selectLesson(lesson: TypingLesson) {
    this.selectedLesson = lesson;
    this.isTypingMode = true;
    this.isRaceMode = false;
    this.userInput = '';
    this.currentLessonIndex = 0;
    this.accuracy = 0;
    this.wpm = 0;
  }

  startRaceMode(lesson: TypingLesson) {
    this.selectedLesson = lesson;
    this.isRaceMode = true;
    this.isTypingMode = false;
    this.userInput = '';
    this.accuracy = 0;
    this.wpm = 0;
    this.raceState = {
      playerProgress: 0,
      opponentProgress: 0,
      gameOver: false,
      playerWon: false,
      startTime: Date.now(),
    };
    this.startOpponentRace();
  }

  private startOpponentRace() {
    let elapsedSeconds = 0;
    this.raceInterval = setInterval(() => {
      if (this.raceState.gameOver) {
        clearInterval(this.raceInterval);
        return;
      }

      elapsedSeconds += 0.05;
      // Opponent progresses at a steady pace multiplied by their difficulty
      this.raceState.opponentProgress += this.opponentSpeed;

      if (this.raceState.opponentProgress >= 100) {
        this.raceState.opponentProgress = 100;
        this.raceState.gameOver = true;
        this.raceState.playerWon = false;
      }
    }, 50);
  }

  resetLesson() {
    this.isTypingMode = false;
    this.userInput = '';
    this.accuracy = 0;
    this.wpm = 0;
  }

  resetRace() {
    if (this.raceInterval) {
      clearInterval(this.raceInterval);
    }
    this.isRaceMode = false;
    this.userInput = '';
    this.accuracy = 0;
    this.wpm = 0;
    this.raceState = {
      playerProgress: 0,
      opponentProgress: 0,
      gameOver: false,
      playerWon: false,
      startTime: 0,
    };
  }

  goBack() {
    if (this.raceInterval) {
      clearInterval(this.raceInterval);
    }
    this.selectedLesson = null;
    this.isRaceMode = false;
    this.resetLesson();
  }

  onInputChange(event: any) {
    this.userInput = event.target.value;
    this.calculateAccuracy();
    this.updateRaceProgress();
  }

  private updateRaceProgress() {
    if (!this.selectedLesson || !this.isRaceMode) return;

    const text = this.selectedLesson.excerpt;
    const correctChars = this.userInput.length;
    this.raceState.playerProgress = (correctChars / text.length) * 100;

    // Check if player finished
    if (this.userInput.length >= text.length) {
      this.raceState.playerProgress = 100;
      this.raceState.gameOver = true;
      this.raceState.playerWon = true;
      clearInterval(this.raceInterval);
    }
  }

  calculateAccuracy() {
    if (!this.selectedLesson) return;

    const text = this.selectedLesson.excerpt;
    let correct = 0;

    for (let i = 0; i < Math.min(this.userInput.length, text.length); i++) {
      if (this.userInput[i] === text[i]) {
        correct++;
      }
    }

    this.accuracy = Math.round((correct / text.length) * 100);
    
    // Simple WPM calculation (characters / 5) / (time in minutes)
    if (this.userInput.length > 0) {
      this.wpm = Math.round((this.userInput.length / 5) * 60) / 60; // Simplified calculation
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#999';
    }
  }
}
