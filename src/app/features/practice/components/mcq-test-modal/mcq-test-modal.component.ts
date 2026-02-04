import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MCQQuestion, SkillAssessment, TestResult, MCQOption } from '../../services/practice.service';

@Component({
  selector: 'app-mcq-test-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './mcq-test-modal.component.html',
  styleUrl: './mcq-test-modal.component.scss'
})
export class MCQTestModalComponent implements OnInit {
  questions: MCQQuestion[] = [];
  assessment!: SkillAssessment;
  currentQuestionIndex = 0;
  currentQuestion!: MCQQuestion;
  selectedAnswers: { [questionId: string]: string } = {};
  showResults = false;
  testResult!: TestResult;
  timeRemaining: number = 0;
  timerInterval: any;

  constructor(
    public dialogRef: MatDialogRef<MCQTestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      assessment: SkillAssessment;
      questions: MCQQuestion[];
      passingScore: number;
      duration: number;
    }
  ) {
    this.questions = data.questions;
    this.assessment = data.assessment;
    this.timeRemaining = data.duration * 60; // Convert to seconds
  }

  ngOnInit(): void {
    if (this.questions.length > 0) {
      this.currentQuestion = this.questions[0];
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitTest();
      }
    }, 1000);
  }

  selectAnswer(option: MCQOption): void {
    this.selectedAnswers[this.currentQuestion.id] = option.id;
  }

  isAnswerSelected(option: MCQOption): boolean {
    return this.selectedAnswers[this.currentQuestion.id] === option.id;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
  }

  getProgressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getSelectedOption(question: MCQQuestion): MCQOption | undefined {
    const selectedId = this.selectedAnswers[question.id];
    return question.options.find(o => o.id === selectedId);
  }

  getCorrectOption(question: MCQQuestion): MCQOption | undefined {
    return question.options.find(o => o.isCorrect);
  }

  isAnswerCorrect(question: MCQQuestion): boolean {
    const selectedOption = this.getSelectedOption(question);
    return selectedOption ? selectedOption.isCorrect : false;
  }

  submitTest(): void {
    clearInterval(this.timerInterval);
    // Calculate score
    let correctAnswers = 0;
    const answers: { questionId: string; selectedOptionId: string }[] = [];

    this.questions.forEach((question) => {
      const selectedOptionId = this.selectedAnswers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        const correctOption = question.options.find(opt => opt.isCorrect);

        if (selectedOption?.isCorrect) {
          correctAnswers++;
        }

        answers.push({
          questionId: question.id,
          selectedOptionId: selectedOptionId
        });
      }
    });

    const score = (correctAnswers / this.questions.length) * 100;
    const passed = score >= this.data.passingScore;

    this.testResult = {
      topic: this.assessment.topic,
      totalQuestions: this.questions.length,
      correctAnswers,
      score,
      passed,
      answers
    };

    this.showResults = true;
  }

  closeDialog(): void {
    this.dialogRef.close(this.showResults ? this.testResult : undefined);
  }

  retakeTest(): void {
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.questions[0];
    this.selectedAnswers = {};
    this.showResults = false;
    this.timeRemaining = this.data.duration * 60;
    this.startTimer();
  }

  reviewAnswers(): void {
    // This would open a detailed review of answers
    this.dialogRef.close(this.testResult);
  }
}
