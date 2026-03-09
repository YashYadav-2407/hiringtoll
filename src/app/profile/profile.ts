import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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

interface ActivityCell {
  dateKey: string;
  displayDate: string;
  count: number;
  level: number;
}

type HeatmapRange = 30 | 90 | 180;

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports: [
    MatDividerModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly USER_STORAGE_KEY = 'user';
  private readonly PRACTICE_SOLVED_KEY = 'practice_solved_problems';
  private readonly PROFILE_ACTIVITY_KEY = 'profile_activity_map';
  private readonly HEATMAP_DAYS = 180;

  user: UserProfile = {
    name: '',
    username: '',
    country: '',
    role: '',
    institution: '',
    email: '',
    avatar: 'assets/profile.jpg'
  };

  editableUser: UserProfile = { ...this.user };
  resume: Resume | null = null;
  isLoadingResume = false;
  isEditingProfile = false;

  totalSolvedProblems = 0;
  profileCompletion = 0;
  resumeCompletion = 0;
  currentStreak = 0;
  bestStreak = 0;
  lastActiveLabel = 'No activity yet';

  selectedHeatmapRange: HeatmapRange = 90;
  readonly heatmapRanges: HeatmapRange[] = [30, 90, 180];
  heatmapCells: ActivityCell[] = [];

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
      this.editableUser = { ...this.user };
    }

    // Load resume
    this.loadResume();
    this.refreshDashboardStats();
    this.trackDailyActivity();
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
        this.updateResumeCompletion();
      });
  }

  get visibleHeatmapCells(): ActivityCell[] {
    return this.heatmapCells.slice(-this.selectedHeatmapRange);
  }

  setHeatmapRange(range: HeatmapRange): void {
    this.selectedHeatmapRange = range;
  }

  getCellTooltip(cell: ActivityCell): string {
    const suffix = cell.count === 1 ? 'entry' : 'entries';
    return `${cell.displayDate}: ${cell.count} ${suffix}`;
  }

  startEditProfile(): void {
    this.editableUser = { ...this.user };
    this.isEditingProfile = true;
  }

  cancelEditProfile(): void {
    this.editableUser = { ...this.user };
    this.isEditingProfile = false;
  }

  saveProfileDetails(): void {
    this.user = {
      ...this.user,
      ...this.editableUser,
      name: (this.editableUser.name || '').trim(),
      email: (this.editableUser.email || '').trim(),
      username: (this.editableUser.username || '').trim(),
      country: (this.editableUser.country || '').trim(),
      role: (this.editableUser.role || '').trim(),
      institution: (this.editableUser.institution || '').trim()
    };

    this.persistCurrentUser();
    this.isEditingProfile = false;
    this.trackDailyActivity(2);
    this.refreshDashboardStats();

    this.snackBar.open('Profile details updated', 'Close', {
      duration: 2500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  copyEmail(): void {
    if (!this.user.email) {
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.user.email).then(() => {
        this.snackBar.open('Email copied to clipboard', 'Close', {
          duration: 2200,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      });
    }
  }

  /**
   * Open resume builder dialog
   */
  openResumeBuilder(): void {
    this.trackDailyActivity(3);

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
        this.trackDailyActivity(2);
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

  private refreshDashboardStats(): void {
    this.totalSolvedProblems = this.getSolvedProblemsCount();
    this.profileCompletion = this.getProfileCompletion();
    this.buildHeatmapCells();
    this.updateStreakStats();
  }

  private getSolvedProblemsCount(): number {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(this.PRACTICE_SOLVED_KEY);
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch (error) {
      console.error('Error reading solved problem stats:', error);
    }

    return 0;
  }

  private getProfileCompletion(): number {
    const checks = [
      !!this.user.name,
      !!this.user.email,
      !!this.user.username,
      !!this.user.country,
      !!this.user.role,
      !!this.user.institution
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }

  private updateResumeCompletion(): void {
    if (!this.resume) {
      this.resumeCompletion = 0;
      return;
    }

    const hasPersonal = !!(
      this.resume.personalInfo.fullName &&
      this.resume.personalInfo.email &&
      this.resume.personalInfo.phone &&
      this.resume.personalInfo.location
    );

    const score =
      (hasPersonal ? 40 : 0) +
      (this.resume.experience.length > 0 ? 20 : 0) +
      (this.resume.education.length > 0 ? 20 : 0) +
      (this.resume.skills.length > 0 ? 20 : 0);

    this.resumeCompletion = score;
  }

  private trackDailyActivity(increment = 1): void {
    const todayKey = this.getDateKey(new Date());
    const activityMap = this.getActivityMap();
    activityMap[todayKey] = (activityMap[todayKey] || 0) + increment;
    this.saveActivityMap(activityMap);
    this.refreshDashboardStats();
  }

  private buildHeatmapCells(): void {
    const activityMap = this.getActivityMap();
    const cells: ActivityCell[] = [];

    for (let i = this.HEATMAP_DAYS - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = this.getDateKey(date);
      const count = activityMap[dateKey] || 0;

      cells.push({
        dateKey,
        displayDate: date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        count,
        level: this.getHeatmapLevel(count)
      });
    }

    this.heatmapCells = cells;
    const lastActiveCell = [...cells].reverse().find(cell => cell.count > 0);
    this.lastActiveLabel = lastActiveCell ? lastActiveCell.displayDate : 'No activity yet';
  }

  private getHeatmapLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 7) return 3;
    return 4;
  }

  private updateStreakStats(): void {
    const cells = this.heatmapCells;
    let current = 0;
    let best = 0;
    let running = 0;

    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i].count > 0) {
        current++;
      } else {
        break;
      }
    }

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].count > 0) {
        running++;
        best = Math.max(best, running);
      } else {
        running = 0;
      }
    }

    this.currentStreak = current;
    this.bestStreak = best;
  }

  private persistCurrentUser(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const currentRaw = localStorage.getItem(this.USER_STORAGE_KEY);
        const existingUser = currentRaw ? JSON.parse(currentRaw) : {};
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify({ ...existingUser, ...this.user }));
      }
    } catch (error) {
      console.error('Error persisting user profile:', error);
    }
  }

  private getDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getActivityMap(): Record<string, number> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(this.PROFILE_ACTIVITY_KEY);
        const parsed: unknown = saved ? JSON.parse(saved) : {};
        return parsed && typeof parsed === 'object' ? (parsed as Record<string, number>) : {};
      }
    } catch (error) {
      console.error('Error reading profile activity:', error);
    }

    return {};
  }

  private saveActivityMap(activityMap: Record<string, number>): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.PROFILE_ACTIVITY_KEY, JSON.stringify(activityMap));
      }
    } catch (error) {
      console.error('Error saving profile activity:', error);
    }
  }
}
