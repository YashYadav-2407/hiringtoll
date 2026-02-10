import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  posts = [
    {
      title: 'Top 10 DSA Patterns Every Developer Should Know',
      excerpt: 'Master these fundamental patterns to solve 90% of coding interview questions with confidence.',
      date: 'Jan 15, 2025',
      readTime: '8 min read',
      tag: 'DSA',
      icon: 'data_object',
    },
    {
      title: 'System Design Interview: A Complete Guide',
      excerpt: 'From load balancers to databases — everything you need to ace your system design round.',
      date: 'Jan 10, 2025',
      readTime: '12 min read',
      tag: 'System Design',
      icon: 'architecture',
    },
    {
      title: 'How to Build a Standout Developer Resume',
      excerpt: 'Tips and tricks from hiring managers on crafting a resume that gets noticed.',
      date: 'Jan 5, 2025',
      readTime: '6 min read',
      tag: 'Career',
      icon: 'description',
    },
    {
      title: 'Behavioral Interview Questions Decoded',
      excerpt: 'Use the STAR method to answer behavioral questions like a pro. Includes sample answers.',
      date: 'Dec 28, 2024',
      readTime: '7 min read',
      tag: 'Interview',
      icon: 'psychology',
    },
    {
      title: 'Speed Up Your Typing for Coding Tests',
      excerpt: 'Practical exercises and tools to increase your coding speed and accuracy.',
      date: 'Dec 20, 2024',
      readTime: '5 min read',
      tag: 'Productivity',
      icon: 'keyboard',
    },
    {
      title: 'Remote Interview Tips: What Nobody Tells You',
      excerpt: 'Technical setup, environment, and communication tips for nailing remote interviews.',
      date: 'Dec 15, 2024',
      readTime: '6 min read',
      tag: 'Tips',
      icon: 'videocam',
    },
  ];
}
