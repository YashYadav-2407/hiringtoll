import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  professionalSummary: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface Resume {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  createdDate: string;
  lastModified: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private resumeSubject = new BehaviorSubject<Resume | null>(null);
  public resume$ = this.resumeSubject.asObservable();

  constructor() {
    this.loadResume();
  }

  /**
   * Load resume from localStorage
   */
  private loadResume(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('resume');
        if (saved) {
          this.resumeSubject.next(JSON.parse(saved));
        } else {
          // Initialize with empty resume template
          this.resumeSubject.next(this.createDefaultResume());
        }
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      this.resumeSubject.next(this.createDefaultResume());
    }
  }

  /**
   * Create default empty resume
   */
  private createDefaultResume(): Resume {
    return {
      id: this.generateId(),
      title: 'My Resume',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        professionalSummary: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },
      experience: [],
      education: [],
      skills: [],
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
  }

  /**
   * Get current resume
   */
  getCurrentResume(): Resume | null {
    return this.resumeSubject.value;
  }

  /**
   * Save resume to localStorage and update subject
   */
  saveResume(resume: Resume): Observable<Resume> {
    return new Observable(observer => {
      try {
        resume.lastModified = new Date().toISOString();
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('resume', JSON.stringify(resume));
        }
        this.resumeSubject.next(resume);
        observer.next(resume);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Update personal info
   */
  updatePersonalInfo(personalInfo: PersonalInfo): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        resume.personalInfo = personalInfo;
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Add experience
   */
  addExperience(experience: Omit<Experience, 'id'>): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        const newExperience: Experience = {
          ...experience,
          id: this.generateId()
        };
        resume.experience.push(newExperience);
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Update experience
   */
  updateExperience(id: string, experience: Partial<Experience>): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        const index = resume.experience.findIndex(e => e.id === id);
        if (index !== -1) {
          resume.experience[index] = { ...resume.experience[index], ...experience };
        }
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Delete experience
   */
  deleteExperience(id: string): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        resume.experience = resume.experience.filter(e => e.id !== id);
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Add education
   */
  addEducation(education: Omit<Education, 'id'>): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        const newEducation: Education = {
          ...education,
          id: this.generateId()
        };
        resume.education.push(newEducation);
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Update education
   */
  updateEducation(id: string, education: Partial<Education>): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        const index = resume.education.findIndex(e => e.id === id);
        if (index !== -1) {
          resume.education[index] = { ...resume.education[index], ...education };
        }
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Delete education
   */
  deleteEducation(id: string): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        resume.education = resume.education.filter(e => e.id !== id);
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Add skills
   */
  addSkills(skillCategory: Omit<Skill, 'id'>): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        const newSkills: Skill = {
          ...skillCategory,
          id: this.generateId()
        };
        resume.skills.push(newSkills);
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Update skills
   */
  updateSkills(id: string, skills: Partial<Skill>): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        const index = resume.skills.findIndex(s => s.id === id);
        if (index !== -1) {
          resume.skills[index] = { ...resume.skills[index], ...skills };
        }
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Delete skills
   */
  deleteSkills(id: string): Observable<Resume> {
    return new Observable(observer => {
      try {
        const resume = this.resumeSubject.value || this.createDefaultResume();
        resume.skills = resume.skills.filter(s => s.id !== id);
        this.saveResume(resume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Reset resume
   */
  resetResume(): Observable<Resume> {
    return new Observable(observer => {
      try {
        const defaultResume = this.createDefaultResume();
        this.saveResume(defaultResume).subscribe(
          result => observer.next(result),
          error => observer.error(error),
          () => observer.complete()
        );
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
