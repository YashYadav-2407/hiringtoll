import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

interface SidebarProfile {
  name: string;
  subtitle: string;
  avatar: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  showSidenav = signal(false);
  sidebarProfile: SidebarProfile = {
    name: 'Complete Profile',
    subtitle: 'Add your details',
    avatar: 'assets/profile.jpg',
  };

  constructor(private router: Router, private authService: Auth) {}

  ngOnInit() {
    this.loadSidebarProfile();

    this.router.events.subscribe(() => {
      this.showSidenav.set(this.router.url === '/' || this.router.url === '/dashboard' || this.router.url === '/login');
      this.loadSidebarProfile();
    });
  }

  openProfilePage(): void {
    this.router.navigate(['/profile']);
  }

  onSidebarAvatarError(event: Event): void {
    const imageElement = event.target as HTMLImageElement | null;
    if (!imageElement) {
      return;
    }

    imageElement.src = 'assets/profile.jpg';
  }

  private loadSidebarProfile(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.sidebarProfile = {
        name: 'Complete Profile',
        subtitle: 'Add your details',
        avatar: 'assets/profile.jpg',
      };
      return;
    }

    this.sidebarProfile = {
      name: currentUser.name || currentUser.username || 'Complete Profile',
      subtitle: currentUser.role || currentUser.email || 'View your profile',
      avatar: currentUser.avatar || 'assets/profile.jpg',
    };
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
