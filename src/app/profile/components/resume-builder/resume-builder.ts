import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResumeService, Resume, Experience, Education, Skill } from '../../services/resume.service';

@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.html',
  styleUrls: ['./resume-builder.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
    MatSelectModule
  ]
})
export class ResumeBuilderComponent implements OnInit, OnDestroy {
  resume: Resume | null = null;
  personalInfoForm!: FormGroup;
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  skillsForm!: FormGroup;

  editingExperienceId: string | null = null;
  editingEducationId: string | null = null;
  editingSkillsId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    public dialogRef: MatDialogRef<ResumeBuilderComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadResume();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize all forms
   */
  private initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{10,}$/)]],
      location: ['', Validators.required],
      professionalSummary: ['', Validators.maxLength(500)],
      linkedin: [''],
      github: [''],
      portfolio: ['']
    });

    this.experienceForm = this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      currentlyWorking: [false],
      description: ['', Validators.required],
      achievements: ['']
    });

    this.educationForm = this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      field: ['', Validators.required],
      graduationDate: ['', Validators.required],
      gpa: [''],
      achievements: ['']
    });

    this.skillsForm = this.fb.group({
      category: ['', Validators.required],
      skills: ['', Validators.required]
    });
  }

  /**
   * Load resume from service
   */
  private loadResume(): void {
    this.resumeService.resume$
      .pipe(takeUntil(this.destroy$))
      .subscribe((resume: Resume | null) => {
        this.resume = resume;
        if (resume) {
          this.personalInfoForm.patchValue(resume.personalInfo);
        }
      });
  }

  /**
   * Save personal info
   */
  savePersonalInfo(): void {
    if (this.personalInfoForm.valid) {
      this.resumeService.updatePersonalInfo(this.personalInfoForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Personal information saved successfully!');
          },
          error: (error: any) => {
            console.error('Error saving personal info:', error);
            alert('Error saving personal information');
          }
        });
    } else {
      alert('Please fill all required fields correctly');
    }
  }

  /**
   * Add experience
   */
  addExperience(): void {
    if (this.experienceForm.valid) {
      const achievements = this.experienceForm.get('achievements')?.value
        .split('\n')
        .filter((a: string) => a.trim()) || [];

      const experience = {
        jobTitle: this.experienceForm.get('jobTitle')?.value,
        company: this.experienceForm.get('company')?.value,
        startDate: this.experienceForm.get('startDate')?.value,
        endDate: this.experienceForm.get('endDate')?.value,
        currentlyWorking: this.experienceForm.get('currentlyWorking')?.value,
        description: this.experienceForm.get('description')?.value,
        achievements
      };

      this.resumeService.addExperience(experience)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.experienceForm.reset();
            alert('Experience added successfully!');
          },
          error: (error: any) => {
            console.error('Error adding experience:', error);
            alert('Error adding experience');
          }
        });
    } else {
      alert('Please fill all required fields');
    }
  }

  /**
   * Edit experience
   */
  editExperience(experience: Experience): void {
    this.experienceForm.patchValue({
      jobTitle: experience.jobTitle,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate,
      currentlyWorking: experience.currentlyWorking,
      description: experience.description,
      achievements: experience.achievements.join('\n')
    });
    this.editingExperienceId = experience.id;
  }

  /**
   * Update experience
   */
  updateExperience(): void {
    if (this.experienceForm.valid && this.editingExperienceId) {
      const achievements = this.experienceForm.get('achievements')?.value
        .split('\n')
        .filter((a: string) => a.trim()) || [];

      this.resumeService.updateExperience(this.editingExperienceId, {
        ...this.experienceForm.value,
        achievements
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.experienceForm.reset();
            this.editingExperienceId = null;
            alert('Experience updated successfully!');
          },
          error: (error) => {
            console.error('Error updating experience:', error);
            alert('Error updating experience');
          }
        });
    }
  }

  /**
   * Delete experience
   */
  deleteExperience(id: string): void {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.resumeService.deleteExperience(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Experience deleted successfully!');
          },
          error: (error) => {
            console.error('Error deleting experience:', error);
            alert('Error deleting experience');
          }
        });
    }
  }

  /**
   * Cancel editing experience
   */
  cancelEditingExperience(): void {
    this.experienceForm.reset();
    this.editingExperienceId = null;
  }

  /**
   * Add education
   */
  addEducation(): void {
    if (this.educationForm.valid) {
      const achievements = this.educationForm.get('achievements')?.value
        .split('\n')
        .filter((a: string) => a.trim()) || [];

      const education = {
        institution: this.educationForm.get('institution')?.value,
        degree: this.educationForm.get('degree')?.value,
        field: this.educationForm.get('field')?.value,
        graduationDate: this.educationForm.get('graduationDate')?.value,
        gpa: this.educationForm.get('gpa')?.value,
        achievements
      };

      this.resumeService.addEducation(education)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.educationForm.reset();
            alert('Education added successfully!');
          },
          error: (error) => {
            console.error('Error adding education:', error);
            alert('Error adding education');
          }
        });
    } else {
      alert('Please fill all required fields');
    }
  }

  /**
   * Edit education
   */
  editEducation(education: Education): void {
    this.educationForm.patchValue({
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      graduationDate: education.graduationDate,
      gpa: education.gpa,
      achievements: education.achievements?.join('\n') || ''
    });
    this.editingEducationId = education.id;
  }

  /**
   * Update education
   */
  updateEducation(): void {
    if (this.educationForm.valid && this.editingEducationId) {
      const achievements = this.educationForm.get('achievements')?.value
        .split('\n')
        .filter((a: string) => a.trim()) || [];

      this.resumeService.updateEducation(this.editingEducationId, {
        ...this.educationForm.value,
        achievements
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.educationForm.reset();
            this.editingEducationId = null;
            alert('Education updated successfully!');
          },
          error: (error) => {
            console.error('Error updating education:', error);
            alert('Error updating education');
          }
        });
    }
  }

  /**
   * Delete education
   */
  deleteEducation(id: string): void {
    if (confirm('Are you sure you want to delete this education?')) {
      this.resumeService.deleteEducation(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Education deleted successfully!');
          },
          error: (error) => {
            console.error('Error deleting education:', error);
            alert('Error deleting education');
          }
        });
    }
  }

  /**
   * Cancel editing education
   */
  cancelEditingEducation(): void {
    this.educationForm.reset();
    this.editingEducationId = null;
  }

  /**
   * Add skills
   */
  addSkills(): void {
    if (this.skillsForm.valid) {
      const skills = this.skillsForm.get('skills')?.value
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s) || [];

      this.resumeService.addSkills({
        category: this.skillsForm.get('category')?.value,
        skills
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.skillsForm.reset();
            alert('Skills added successfully!');
          },
          error: (error) => {
            console.error('Error adding skills:', error);
            alert('Error adding skills');
          }
        });
    } else {
      alert('Please fill all required fields');
    }
  }

  /**
   * Edit skills
   */
  editSkills(skillCategory: Skill): void {
    this.skillsForm.patchValue({
      category: skillCategory.category,
      skills: skillCategory.skills.join(', ')
    });
    this.editingSkillsId = skillCategory.id;
  }

  /**
   * Update skills
   */
  updateSkills(): void {
    if (this.skillsForm.valid && this.editingSkillsId) {
      const skills = this.skillsForm.get('skills')?.value
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s) || [];

      this.resumeService.updateSkills(this.editingSkillsId, {
        category: this.skillsForm.get('category')?.value,
        skills
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.skillsForm.reset();
            this.editingSkillsId = null;
            alert('Skills updated successfully!');
          },
          error: (error) => {
            console.error('Error updating skills:', error);
            alert('Error updating skills');
          }
        });
    }
  }

  /**
   * Delete skills
   */
  deleteSkills(id: string): void {
    if (confirm('Are you sure you want to delete this skill category?')) {
      this.resumeService.deleteSkills(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Skills deleted successfully!');
          },
          error: (error) => {
            console.error('Error deleting skills:', error);
            alert('Error deleting skills');
          }
        });
    }
  }

  /**
   * Cancel editing skills
   */
  cancelEditingSkills(): void {
    this.skillsForm.reset();
    this.editingSkillsId = null;
  }

  /**
   * Close dialog
   */
  closeDialog(): void {
    this.dialogRef.close(this.resume);
  }
}
