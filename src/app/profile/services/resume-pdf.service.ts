import { Injectable } from '@angular/core';
import { Resume, Experience, Education, Skill } from './resume.service';

@Injectable({
  providedIn: 'root'
})
export class ResumePdfService {

  /**
   * Generate PDF content structure for pdfmake
   */
  generatePdfContent(resume: Resume): any {
    const content: any[] = [];

    // Header with personal info
    content.push(this.createHeader(resume.personalInfo));

    // Professional Summary
    if (resume.personalInfo.professionalSummary) {
      content.push({
        text: 'PROFESSIONAL SUMMARY',
        style: 'sectionTitle'
      });
      content.push({
        text: resume.personalInfo.professionalSummary,
        style: 'bodyText',
        margin: [0, 0, 0, 12]
      });
    }

    // Experience Section
    if (resume.experience && resume.experience.length > 0) {
      content.push({
        text: 'EXPERIENCE',
        style: 'sectionTitle'
      });
      content.push(this.createExperienceContent(resume.experience));
    }

    // Education Section
    if (resume.education && resume.education.length > 0) {
      content.push({
        text: 'EDUCATION',
        style: 'sectionTitle'
      });
      content.push(this.createEducationContent(resume.education));
    }

    // Skills Section
    if (resume.skills && resume.skills.length > 0) {
      content.push({
        text: 'SKILLS',
        style: 'sectionTitle'
      });
      content.push(this.createSkillsContent(resume.skills));
    }

    return content;
  }

  /**
   * Create header with personal information
   */
  private createHeader(personalInfo: any): any {
    const headerContent: any[] = [];

    // Name
    headerContent.push({
      text: personalInfo.fullName,
      style: 'header',
      alignment: 'center'
    });

    // Contact info
    const contactParts: string[] = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.location) contactParts.push(personalInfo.location);

    if (contactParts.length > 0) {
      headerContent.push({
        text: contactParts.join(' | '),
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 6]
      });
    }

    // Links
    const linkParts: string[] = [];
    if (personalInfo.linkedin) linkParts.push(personalInfo.linkedin);
    if (personalInfo.github) linkParts.push(personalInfo.github);
    if (personalInfo.portfolio) linkParts.push(personalInfo.portfolio);

    if (linkParts.length > 0) {
      headerContent.push({
        text: linkParts.join(' | '),
        style: 'links',
        alignment: 'center',
        margin: [0, 0, 0, 12]
      });
    }

    return {
      stack: headerContent,
      margin: [0, 0, 0, 12]
    };
  }

  /**
   * Create experience section content
   */
  private createExperienceContent(experience: Experience[]): any {
    const content: any[] = [];

    experience.forEach((exp, index) => {
      const dateRange = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Present`;

      content.push({
        text: exp.jobTitle,
        style: 'jobTitle'
      });

      content.push({
        text: `${exp.company} | ${dateRange}`,
        style: 'jobCompany',
        margin: [0, 0, 0, 4]
      });

      if (exp.description) {
        content.push({
          text: exp.description,
          style: 'bodyText',
          margin: [0, 0, 0, 4]
        });
      }

      if (exp.achievements && exp.achievements.length > 0) {
        content.push({
          ul: exp.achievements.map(achievement => ({
            text: achievement,
            style: 'listItem'
          })),
          margin: [20, 0, 0, 4]
        });
      }

      if (index < experience.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 8] });
      }
    });

    return {
      stack: content,
      margin: [0, 0, 0, 12]
    };
  }

  /**
   * Create education section content
   */
  private createEducationContent(education: Education[]): any {
    const content: any[] = [];

    education.forEach((edu, index) => {
      content.push({
        text: `${edu.degree} in ${edu.field}`,
        style: 'educationDegree'
      });

      const educationInfo: string[] = [edu.institution];
      if (edu.graduationDate) educationInfo.push(edu.graduationDate);
      if (edu.gpa) educationInfo.push(`GPA: ${edu.gpa}`);

      content.push({
        text: educationInfo.join(' | '),
        style: 'educationInfo',
        margin: [0, 0, 0, 4]
      });

      if (edu.achievements && edu.achievements.length > 0) {
        content.push({
          ul: edu.achievements.map(achievement => ({
            text: achievement,
            style: 'listItem'
          })),
          margin: [20, 0, 0, 4]
        });
      }

      if (index < education.length - 1) {
        content.push({ text: '', margin: [0, 0, 0, 8] });
      }
    });

    return {
      stack: content,
      margin: [0, 0, 0, 12]
    };
  }

  /**
   * Create skills section content
   */
  private createSkillsContent(skills: Skill[]): any {
    const content: any[] = [];

    skills.forEach((skillCategory) => {
      const skillList = skillCategory.skills.join(', ');

      content.push({
        text: skillCategory.category,
        style: 'skillCategory'
      });

      content.push({
        text: skillList,
        style: 'skillList',
        margin: [0, 0, 0, 8]
      });
    });

    return {
      stack: content,
      margin: [0, 0, 0, 12]
    };
  }

  /**
   * Get PDF styles
   */
  getPdfStyles(): any {
    return {
      header: {
        fontSize: 24,
        bold: true,
        color: '#1976d2',
        margin: [0, 0, 0, 2]
      },
      subheader: {
        fontSize: 10,
        color: '#333'
      },
      links: {
        fontSize: 9,
        color: '#666'
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        color: '#1976d2',
        margin: [0, 12, 0, 8],
        border: [false, true, false, false],
        borderColor: '#1976d2'
      },
      jobTitle: {
        fontSize: 11,
        bold: true,
        color: '#333'
      },
      jobCompany: {
        fontSize: 10,
        color: '#666',
        italics: true
      },
      educationDegree: {
        fontSize: 11,
        bold: true,
        color: '#333'
      },
      educationInfo: {
        fontSize: 10,
        color: '#666'
      },
      skillCategory: {
        fontSize: 10,
        bold: true,
        color: '#333'
      },
      skillList: {
        fontSize: 9,
        color: '#555'
      },
      bodyText: {
        fontSize: 9,
        color: '#555',
        alignment: 'justify'
      },
      listItem: {
        fontSize: 9,
        color: '#555'
      }
    };
  }

  /**
   * Get PDF document definition
   */
  getPdfDocDefinition(resume: Resume): any {
    return {
      content: this.generatePdfContent(resume),
      styles: this.getPdfStyles(),
      defaultStyle: {
        font: 'Helvetica'
      },
      pageMargins: [40, 40, 40, 40]
    };
  }
}
