import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../core/services/auth';
import { Router } from '@angular/router';
import { ResumeService, Resume } from './services/resume.service';
import { ResumePdfService } from './services/resume-pdf.service';
import { ResumeBuilderComponent } from './components/resume-builder/resume-builder';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface UserProfile {
  name: string;
  username?: string;
  country?: string;
  role?: string;
  institution?: string;
  email?: string;
  avatar?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports: [
    MatDividerModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: UserProfile = {
    name: '',
    username: '',
    country: '',
    role: '',
    institution: '',
    email: '',
    avatar: 'assets/profile.jpg'
  };

  resume: Resume | null = null;
  isLoadingResume = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: Auth,
    private router: Router,
    private resumeService: ResumeService,
    private resumePdfService: ResumePdfService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get user data from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        username: currentUser.username || 'N/A',
        country: currentUser.country || 'N/A',
        role: currentUser.role || 'N/A',
        institution: currentUser.institution || 'N/A',
        avatar: currentUser.avatar || 'assets/profile.jpg'
      };
    }

    // Load resume
    this.loadResume();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load resume from service
   */
  private loadResume(): void {
    this.isLoadingResume = true;
    this.resumeService.resume$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resume => {
        this.resume = resume;
        this.isLoadingResume = false;
      });
  }

  /**
   * Open resume builder dialog
   */
  openResumeBuilder(): void {
    const dialogRef = this.dialog.open(ResumeBuilderComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: false
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.snackBar.open('Resume updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
  }

  /**
   * Edit resume
   */
  editResume(): void {
    this.openResumeBuilder();
  }

  /**
   * Download resume as PDF
   */
  downloadPdf(): void {
    if (!this.resume) {
      this.snackBar.open('No resume to download. Please create one first.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    try {
      // Check if pdfMake is available globally
      if ((window as any).pdfMake) {
        const pdfMake = (window as any).pdfMake;
        const docDefinition = this.resumePdfService.getPdfDocDefinition(this.resume);
        pdfMake.createPdf(docDefinition).download(`${this.resume.personalInfo.fullName || 'Resume'}.pdf`);
        this.snackBar.open('PDF downloaded successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      } else {
        this.snackBar.open('PDF library not loaded. Please add pdfmake library.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.snackBar.open('Error generating PDF. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }

  /**
   * Check if resume has data
   */
  hasResumeData(): boolean {
    if (!this.resume) return false;
    const { personalInfo, experience, education, skills } = this.resume;
    return !!(personalInfo.fullName || experience.length > 0 || education.length > 0 || skills.length > 0);
  }
}
