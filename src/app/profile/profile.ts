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
  bio?: string;
}

type ProfileFieldKey = keyof Pick<UserProfile, 'name' | 'email' | 'username' | 'country' | 'role' | 'institution'>;

interface ProfileField {
  key: ProfileFieldKey;
  label: string;
  placeholder: string;
  required: boolean;
  icon: string;
  inputType?: 'text' | 'email';
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
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
  private readonly MAX_BIO_WORDS = 30;

  user: UserProfile = {
    name: '',
    username: '',
    country: '',
    role: '',
    institution: '',
    email: '',
    avatar: 'assets/profile.jpg',
    bio: ''
  };

  editableUser: UserProfile = { ...this.user };
  resume: Resume | null = null;
  isLoadingResume = false;
  isEditingProfile = false;
  isDownloadingResume = false;

  totalSolvedProblems = 0;
  profileCompletion = 0;
  resumeCompletion = 0;
  currentStreak = 0;
  bestStreak = 0;
  lastActiveLabel = 'No activity yet';

  selectedHeatmapRange: HeatmapRange = 90;
  readonly heatmapRanges: HeatmapRange[] = [30, 90, 180];
  heatmapCells: ActivityCell[] = [];

  readonly profileFields: ProfileField[] = [
    { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', required: true, icon: 'badge' },
    { key: 'email', label: 'Email', placeholder: 'name@example.com', required: true, icon: 'mail', inputType: 'email' },
    { key: 'username', label: 'Username', placeholder: 'Choose a username', required: true, icon: 'alternate_email' },
    { key: 'country', label: 'Country', placeholder: 'Your country', required: false, icon: 'public' },
    { key: 'role', label: 'Role', placeholder: 'Student, Engineer, etc.', required: false, icon: 'work' },
    { key: 'institution', label: 'Institution', placeholder: 'School or company', required: false, icon: 'school' }
  ];

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
        username: currentUser.username || '',
        country: currentUser.country || '',
        role: currentUser.role || '',
        institution: currentUser.institution || '',
        avatar: currentUser.avatar || 'assets/profile.jpg',
        bio: this.sanitizeBio(currentUser.bio || '')
      };
      this.editableUser = { ...this.user };
    }

    this.hydrateUserFromStorage();

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

  get requiredMissingFields(): string[] {
    return this.profileFields
      .filter(field => field.required)
      .filter(field => !this.getTrimmedValue(this.user[field.key]))
      .map(field => field.label);
  }

  get profileStatusLabel(): string {
    if (this.profileCompletion >= 90) {
      return 'Profile is production-ready';
    }
    if (this.profileCompletion >= 60) {
      return 'Strong progress, a few details left';
    }
    return 'Complete required fields to unlock full profile value';
  }

  get bioWordCount(): number {
    return this.countWords(this.editableUser.bio);
  }

  get bioPreview(): string {
    return this.getTrimmedValue(this.user.bio) || 'Add a short bio (up to 30 words) to tell others about your focus and goals.';
  }

  get bioActionLabel(): string {
    return this.getTrimmedValue(this.user.bio) ? 'Edit Bio' : 'Add Bio';
  }

  get isBioTooLong(): boolean {
    return this.bioWordCount > this.MAX_BIO_WORDS;
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
    const nextUser: UserProfile = {
      ...this.user,
      ...this.editableUser,
      name: this.getTrimmedValue(this.editableUser.name),
      email: this.getTrimmedValue(this.editableUser.email),
      username: this.getTrimmedValue(this.editableUser.username),
      country: this.getTrimmedValue(this.editableUser.country),
      role: this.getTrimmedValue(this.editableUser.role),
      institution: this.getTrimmedValue(this.editableUser.institution),
      bio: this.sanitizeBio(this.editableUser.bio)
    };

    const avatarValue = this.getTrimmedValue(this.editableUser.avatar);
    nextUser.avatar = avatarValue || 'assets/profile.jpg';

    if (!nextUser.name || !nextUser.email || !nextUser.username) {
      this.snackBar.open('Name, email, and username are required.', 'Close', {
        duration: 2800,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    if (this.countWords(nextUser.bio) > this.MAX_BIO_WORDS) {
      this.snackBar.open('Bio can be maximum 30 words.', 'Close', {
        duration: 2600,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    if (!this.EMAIL_REGEX.test(nextUser.email)) {
      this.snackBar.open('Please enter a valid email address.', 'Close', {
        duration: 2600,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.user = {
      ...nextUser
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

  copyUsername(): void {
    if (!this.user.username) {
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.user.username).then(() => {
        this.snackBar.open('Username copied to clipboard', 'Close', {
          duration: 2200,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      });
    }
  }

  onAvatarFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Please select a valid image file.', 'Close', {
        duration: 2600,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      input.value = '';
      return;
    }

    if (file.size > this.MAX_AVATAR_SIZE_BYTES) {
      this.snackBar.open('Image size must be less than 2MB.', 'Close', {
        duration: 2600,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        return;
      }

      this.applyAvatar(result);
      this.snackBar.open('Profile image updated.', 'Close', {
        duration: 2400,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    };

    reader.onerror = () => {
      this.snackBar.open('Could not read this image file.', 'Close', {
        duration: 2600,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    };

    reader.readAsDataURL(file);
    input.value = '';
  }

  clearAvatar(): void {
    this.applyAvatar('assets/profile.jpg');
    this.snackBar.open('Profile image reset.', 'Close', {
      duration: 2200,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  openBioEditor(): void {
    if (!this.isEditingProfile) {
      this.startEditProfile();
    }
  }

  logFocusSession(): void {
    this.trackDailyActivity(1);
    this.snackBar.open('Focus session logged for today.', 'Close', {
      duration: 2200,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  clearActivityHistory(): void {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Clear all profile activity history? This action cannot be undone.');
      if (!confirmed) {
        return;
      }
    }

    this.saveActivityMap({});
    this.refreshDashboardStats();
    this.snackBar.open('Activity history cleared.', 'Close', {
      duration: 2200,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  reloadProfileFromStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      this.hydrateUserFromStorage();

      this.editableUser = { ...this.user };
      this.refreshDashboardStats();
      this.snackBar.open('Profile synced from local storage.', 'Close', {
        duration: 2400,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    } catch (error) {
      console.error('Error syncing profile from storage:', error);
      this.snackBar.open('Unable to sync profile from local storage.', 'Close', {
        duration: 2600,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }

  getFieldValue(fieldKey: ProfileFieldKey): string {
    return this.getTrimmedValue(this.user[fieldKey]) || 'Not added';
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

  syncProfileToResume(): void {
    const existing = this.resumeService.getCurrentResume();
    if (!existing) {
      this.snackBar.open('Resume is not ready yet. Please try again.', 'Close', {
        duration: 2400,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    const updated: Resume = {
      ...existing,
      personalInfo: {
        ...existing.personalInfo,
        fullName: this.getTrimmedValue(this.user.name) || existing.personalInfo.fullName,
        email: this.getTrimmedValue(this.user.email) || existing.personalInfo.email,
        location: this.getTrimmedValue(this.user.country) || existing.personalInfo.location,
        professionalSummary:
          this.getTrimmedValue(this.user.bio) ||
          existing.personalInfo.professionalSummary ||
          `Aspiring ${this.getTrimmedValue(this.user.role) || 'professional'} focused on consistent problem-solving and skill development.`
      }
    };

    this.resumeService.saveResume(updated).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.updateResumeCompletion();
        this.trackDailyActivity(2);
        this.snackBar.open('Resume prefilled from profile details.', 'Close', {
          duration: 2600,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      },
      error: (error) => {
        console.error('Error prefilling resume from profile:', error);
        this.snackBar.open('Could not prefill resume right now.', 'Close', {
          duration: 2600,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  /**
   * Download resume as PDF
   */
  async downloadPdf(): Promise<void> {
    if (!this.resume) {
      this.snackBar.open('No resume to download. Please create one first.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.isDownloadingResume = true;

    try {
      const pdfMake = await this.getPdfMakeInstance();
      if (!pdfMake) {
        throw new Error('pdfMake could not be initialized');
      }

      const docDefinition = this.resumePdfService.getPdfDocDefinition(this.resume);
      const fileName = `${this.getSafeResumeFileName()}.pdf`;

      const downloaded = await this.tryPdfDownload(pdfMake, docDefinition, fileName);
      if (!downloaded) {
        throw new Error('All PDF download strategies failed');
      }

      this.snackBar.open('Resume downloaded successfully.', 'Close', {
        duration: 2800,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.trackDailyActivity(2);
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.downloadResumeTextFallback();
      this.snackBar.open('PDF download failed. Downloaded TXT version instead.', 'Close', {
        duration: 3800,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    } finally {
      this.isDownloadingResume = false;
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
    const checks = this.profileFields.map(field => !!this.getTrimmedValue(this.user[field.key]));

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

  private getTrimmedValue(value?: string): string {
    const normalized = (value || '').trim();
    return normalized.toUpperCase() === 'N/A' ? '' : normalized;
  }

  private applyAvatar(avatar: string): void {
    const value = this.getTrimmedValue(avatar) || 'assets/profile.jpg';
    this.user.avatar = value;
    this.editableUser.avatar = value;
    this.persistCurrentUser();
  }

  private async getPdfMakeInstance(): Promise<any | null> {
    if (typeof window === 'undefined') {
      return null;
    }

    const existing = (window as any).pdfMake;
    if (existing) {
      return existing;
    }

    try {
      const [pdfMakeModule, fontsModule] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts')
      ]);

      const pdfMake = (pdfMakeModule as any).default || (pdfMakeModule as any).pdfMake || pdfMakeModule;
      const fonts = (fontsModule as any).default || fontsModule;
      const vfs = fonts?.pdfMake?.vfs || fonts?.vfs;

      if (pdfMake && vfs) {
        pdfMake.vfs = vfs;
      }

      (window as any).pdfMake = pdfMake;
      return pdfMake;
    } catch (error) {
      console.error('Error loading pdfMake dynamically:', error);
      return null;
    }
  }

  private getSafeResumeFileName(): string {
    const source = this.getTrimmedValue(this.resume?.personalInfo?.fullName) || 'resume';
    return source
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') || 'resume';
  }

  private async tryPdfDownload(pdfMake: any, docDefinition: any, fileName: string): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    // Strategy 1: pdfMake native download API.
    try {
      await new Promise<void>((resolve, reject) => {
        pdfMake.createPdf(docDefinition).download(fileName, () => resolve());
        setTimeout(() => reject(new Error('Timed out waiting for native download callback')), 2000);
      });
      return true;
    } catch (nativeError) {
      console.warn('Native pdfMake download failed, trying blob fallback.', nativeError);
    }

    // Strategy 2: Blob + anchor download.
    try {
      await new Promise<void>((resolve, reject) => {
        pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
          try {
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            // Delay revoke to avoid race conditions in some browsers/devices.
            setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
      return true;
    } catch (blobError) {
      console.warn('Blob PDF download failed, trying data-url fallback.', blobError);
    }

    // Strategy 3: Open PDF in a new tab via data URL as final PDF fallback.
    try {
      await new Promise<void>((resolve, reject) => {
        pdfMake.createPdf(docDefinition).getDataUrl((dataUrl: string) => {
          const newWindow = window.open(dataUrl, '_blank');
          if (!newWindow) {
            reject(new Error('Popup blocked for PDF data URL window'));
            return;
          }
          resolve();
        });
      });
      return true;
    } catch (dataUrlError) {
      console.warn('All PDF download strategies failed.', dataUrlError);
      return false;
    }
  }

  private downloadResumeTextFallback(): void {
    if (!this.resume || typeof window === 'undefined') {
      return;
    }

    const lines: string[] = [];
    const p = this.resume.personalInfo;
    lines.push(p.fullName || 'Resume');
    lines.push([p.email, p.phone, p.location].filter(Boolean).join(' | '));
    lines.push('');

    if (p.professionalSummary) {
      lines.push('PROFESSIONAL SUMMARY');
      lines.push(p.professionalSummary);
      lines.push('');
    }

    if (this.resume.experience.length) {
      lines.push('EXPERIENCE');
      this.resume.experience.forEach(exp => {
        lines.push(`${exp.jobTitle} - ${exp.company}`);
        lines.push(`${exp.startDate} - ${exp.endDate || 'Present'}`);
        if (exp.description) lines.push(exp.description);
        exp.achievements?.forEach(a => lines.push(`- ${a}`));
        lines.push('');
      });
    }

    if (this.resume.education.length) {
      lines.push('EDUCATION');
      this.resume.education.forEach(edu => {
        lines.push(`${edu.degree} in ${edu.field} - ${edu.institution}`);
        if (edu.graduationDate) lines.push(edu.graduationDate);
        if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
        lines.push('');
      });
    }

    if (this.resume.skills.length) {
      lines.push('SKILLS');
      this.resume.skills.forEach(skill => {
        lines.push(`${skill.category}: ${skill.skills.join(', ')}`);
      });
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.getSafeResumeFileName()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  private hydrateUserFromStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      const raw = localStorage.getItem(this.USER_STORAGE_KEY);
      const parsed: Partial<UserProfile> = raw ? JSON.parse(raw) : {};

      this.user = {
        ...this.user,
        name: this.getTrimmedValue(parsed.name) || this.user.name,
        email: this.getTrimmedValue(parsed.email) || this.user.email,
        username: this.getTrimmedValue(parsed.username) || this.user.username,
        country: this.getTrimmedValue(parsed.country) || this.user.country,
        role: this.getTrimmedValue(parsed.role) || this.user.role,
        institution: this.getTrimmedValue(parsed.institution) || this.user.institution,
        avatar: this.getTrimmedValue(parsed.avatar) || this.user.avatar,
        bio: this.sanitizeBio(parsed.bio) || this.user.bio
      };
    } catch (error) {
      console.error('Error hydrating profile from storage:', error);
    }
  }

  private sanitizeBio(value?: string): string {
    if (!value) {
      return '';
    }

    const words = value.trim().split(/\s+/).filter(Boolean);
    return words.slice(0, this.MAX_BIO_WORDS).join(' ');
  }

  private countWords(value?: string): number {
    const normalized = this.getTrimmedValue(value);
    if (!normalized) {
      return 0;
    }

    return normalized.split(/\s+/).length;
  }
}
