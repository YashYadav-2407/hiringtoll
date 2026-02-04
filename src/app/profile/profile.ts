import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../core/services/auth';
import { Router } from '@angular/router';

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
  imports: [MatDividerModule, CommonModule, MatButtonModule]
})
export class ProfileComponent implements OnInit {
  user: UserProfile = {
    name: '',
    username: '',
    country: '',
    role: '',
    institution: '',
    email: '',
    avatar: 'assets/profile.jpg'
  };

  constructor(private authService: Auth, private router: Router) {}

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
  }
}
