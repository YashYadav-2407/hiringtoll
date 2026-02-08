import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatDividerModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  footerSections: FooterSection[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Learn', path: '/learn' },
        { label: 'Practice', path: '/practice' },
        { label: 'Assess', path: '/assess' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', path: '/blog' },
        { label: 'Help', path: '/help' },
        { label: 'Privacy', path: '/privacy' }
      ]
    }
  ];

  constructor(private router: Router) {}

  /**
   * Navigate to the specified route
   */
  navigateTo(path: string): void {
    this.router.navigate([path]).catch(error => {
      console.error(`Navigation to ${path} failed:`, error);
    });
  }
}
